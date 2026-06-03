package com.shopflow.payment_service.service;

import com.shopflow.payment_service.dto.CreatePaymentRequest;
import com.shopflow.payment_service.dto.PaymentResponse;
import com.shopflow.payment_service.entity.Payment;
import com.shopflow.payment_service.enums.PaymentStatus;
import com.shopflow.payment_service.event.OrderCreatedEvent;
import com.shopflow.payment_service.kafka.PaymentEventProducer;
import com.shopflow.payment_service.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentGateway paymentGateway;
    private final PaymentEventProducer eventProducer;

    @Value("${payment.currency.default:COP}")
    private String defaultCurrency;

    @Transactional
    public void processPayment(OrderCreatedEvent event) {
        List<Payment> existing = paymentRepository.findByOrderId(event.getOrderId());
        if (!existing.isEmpty()) {
            log.warn("Pago ya procesado para orden: {}", event.getOrderId());
            return;
        }

        String currency = event.getCurrency() != null ? event.getCurrency() : defaultCurrency;

        PaymentGateway.PaymentGatewayResult result = paymentGateway.process(
                event.getOrderId(),
                event.getTotalAmount(),
                currency,
                "Pago ShopFlow orden " + event.getOrderId()
        );

        Payment payment = Payment.builder()
                .orderId(event.getOrderId())
                .userId(event.getUserId())
                .amount(event.getTotalAmount())
                .currency(currency)
                .status(result.success() ? PaymentStatus.COMPLETED : PaymentStatus.FAILED)
                .gatewayTransactionId(result.transactionId())
                .gatewayResponse(result.gatewayResponse())
                .description("Pago ShopFlow orden " + event.getOrderId())
                .build();

        paymentRepository.save(payment);
        log.info("Pago guardado con status {} para orden: {}", payment.getStatus(), event.getOrderId());

        if (result.success()) {
            eventProducer.publishPaymentApproved(event.getOrderId(), payment.getId());
        } else {
            eventProducer.publishPaymentFailed(
                    event.getOrderId(),
                    payment.getId(),
                    result.gatewayResponse()
            );
        }
    }

    @Transactional
    public PaymentResponse createPayment(String userId, CreatePaymentRequest request) {
        String currency = request.getCurrency() != null ? request.getCurrency() : defaultCurrency;

        PaymentGateway.PaymentGatewayResult result = paymentGateway.process(
                request.getOrderId(),
                request.getAmount(),
                currency,
                request.getDescription() != null ? request.getDescription()
                        : "Pago ShopFlow orden " + request.getOrderId()
        );

        Payment payment = Payment.builder()
                .orderId(request.getOrderId())
                .userId(userId)
                .amount(request.getAmount())
                .currency(currency)
                .status(result.success() ? PaymentStatus.COMPLETED : PaymentStatus.FAILED)
                .gatewayTransactionId(result.transactionId())
                .gatewayResponse(result.gatewayResponse())
                .description(request.getDescription())
                .build();

        paymentRepository.save(payment);
        return toResponse(payment);
    }

    public PaymentResponse getPayment(String paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado: " + paymentId));
        return toResponse(payment);
    }

    public List<PaymentResponse> getPaymentsByOrder(String orderId) {
        return paymentRepository.findByOrderId(orderId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<PaymentResponse> getMyPayments(String userId) {
        return paymentRepository.findByUserId(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PaymentResponse cancelPayment(String paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado: " + paymentId));
        payment.setStatus(PaymentStatus.CANCELLED);
        paymentRepository.save(payment);
        return toResponse(payment);
    }

    private PaymentResponse toResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .orderId(payment.getOrderId())
                .userId(payment.getUserId())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .status(payment.getStatus())
                .description(payment.getDescription())
                .gatewayTransactionId(payment.getGatewayTransactionId())
                .gatewayResponse(payment.getGatewayResponse())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }
}