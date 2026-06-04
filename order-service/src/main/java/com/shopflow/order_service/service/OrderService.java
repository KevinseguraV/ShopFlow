package com.shopflow.order_service.service;

import com.shopflow.order_service.dto.*;
import com.shopflow.order_service.entity.Order;
import com.shopflow.order_service.entity.OrderItem;
import com.shopflow.order_service.entity.OrderStatus;
import com.shopflow.order_service.event.OrderCreatedEvent;
import com.shopflow.order_service.event.OrderStatusEvent;
import com.shopflow.order_service.event.PaymentEvent;
import com.shopflow.order_service.exception.OrderException;
import com.shopflow.order_service.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Transactional
    public OrderResponse createOrder(String userId, CreateOrderRequest request) {
        List<OrderItem> items = request.getItems().stream()
                .map(i -> OrderItem.builder()
                        .productId(i.getProductId())
                        .productName(i.getProductName())
                        .variantId(i.getVariantId())
                        .quantity(i.getQuantity())
                        .unitPrice(i.getUnitPrice())
                        .totalPrice(i.getUnitPrice() * i.getQuantity())
                        .build())
                .collect(Collectors.toList());

        double totalAmount = items.stream()
                .mapToDouble(OrderItem::getTotalPrice)
                .sum();

        Order order = Order.builder()
                .userId(userId)
                .userEmail(request.getUserEmail())
                .status(OrderStatus.PENDING)
                .items(items)
                .totalAmount(totalAmount)
                .shippingAddress(request.getShippingAddress())
                .build();

        order = orderRepository.save(order);

        // Publica evento a Kafka — inicia el patrón Saga
        OrderCreatedEvent event = OrderCreatedEvent.builder()
                .orderId(order.getId())
                .userId(userId)
                .userEmail(request.getUserEmail())
                .totalAmount(totalAmount)
                .shippingAddress(request.getShippingAddress())
                .items(items.stream()
                        .map(i -> OrderCreatedEvent.OrderItemEvent.builder()
                                .productId(i.getProductId())
                                .productName(i.getProductName())
                                .variantId(i.getVariantId())
                                .quantity(i.getQuantity())
                                .unitPrice(i.getUnitPrice())
                                .build())
                        .collect(Collectors.toList()))
                .build();

        kafkaTemplate.send("order.created", order.getId(), event);
        log.info("Evento order.created publicado para orden: {}", order.getId());

        return toResponse(order);
    }

    public Page<OrderResponse> getUserOrders(String userId, int page, int size) {
        return orderRepository.findByUserId(userId,
                        PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")))
                .map(this::toResponse);
    }

    public OrderResponse getOrderById(String orderId, String userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderException(
                        "Orden no encontrada", HttpStatus.NOT_FOUND));

        if (!order.getUserId().equals(userId)) {
            throw new OrderException("No autorizado", HttpStatus.FORBIDDEN);
        }

        return toResponse(order);
    }

    // Escucha el evento payment.approved — Saga step 2
    @Transactional
    public void handlePaymentApproved(PaymentEvent event) {
        Order order = orderRepository.findById(event.getOrderId())
                .orElseThrow(() -> new OrderException(
                        "Orden no encontrada", HttpStatus.NOT_FOUND));

        order.setStatus(OrderStatus.CONFIRMED);
        order.setPaymentId(event.getPaymentId());
        orderRepository.save(order);

        // Publica OrderStatusEvent con toda la info para notification-service
        kafkaTemplate.send("order.confirmed", order.getId(), buildStatusEvent(order, "CONFIRMED"));
        log.info("Orden confirmada: {}", order.getId());
    }

    // Escucha el evento payment.failed — Saga compensación
    @Transactional
    public void handlePaymentFailed(PaymentEvent event) {
        Order order = orderRepository.findById(event.getOrderId())
                .orElseThrow(() -> new OrderException(
                        "Orden no encontrada", HttpStatus.NOT_FOUND));

        order.setStatus(OrderStatus.CANCELLED);
        order.setFailureReason(event.getReason());
        orderRepository.save(order);

        // Publica OrderStatusEvent con toda la info para notification-service
        kafkaTemplate.send("order.cancelled", order.getId(), buildStatusEvent(order, "CANCELLED"));
        log.warn("Orden cancelada por pago fallido: {}", order.getId());
    }

    // ── Helper: construye el evento de status con todos los datos ────────────
    private OrderStatusEvent buildStatusEvent(Order order, String status) {
        List<OrderStatusEvent.OrderItemEvent> itemEvents = order.getItems().stream()
                .map(i -> OrderStatusEvent.OrderItemEvent.builder()
                        .productId(i.getProductId())
                        .productName(i.getProductName())
                        .variantId(i.getVariantId())
                        .quantity(i.getQuantity())
                        .unitPrice(i.getUnitPrice())
                        .build())
                .collect(Collectors.toList());

        return OrderStatusEvent.builder()
                .orderId(order.getId())
                .userId(order.getUserId())
                .userEmail(order.getUserEmail())
                .status(status)
                .totalAmount(order.getTotalAmount())
                .shippingAddress(order.getShippingAddress())
                .paymentId(order.getPaymentId())
                .failureReason(order.getFailureReason())
                .items(itemEvents)
                .build();
    }

    private OrderResponse toResponse(Order order) {
        List<OrderResponse.ItemResponse> items = order.getItems().stream()
                .map(i -> OrderResponse.ItemResponse.builder()
                        .id(i.getId())
                        .productId(i.getProductId())
                        .productName(i.getProductName())
                        .variantId(i.getVariantId())
                        .quantity(i.getQuantity())
                        .unitPrice(i.getUnitPrice())
                        .totalPrice(i.getTotalPrice())
                        .build())
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .status(order.getStatus())
                .items(items)
                .totalAmount(order.getTotalAmount())
                .shippingAddress(order.getShippingAddress())
                .paymentId(order.getPaymentId())
                .failureReason(order.getFailureReason())
                .createdAt(order.getCreatedAt() != null ?
                        order.getCreatedAt().toString() : null)
                .updatedAt(order.getUpdatedAt() != null ?
                        order.getUpdatedAt().toString() : null)
                .build();
    }
}