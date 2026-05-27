package com.shopflow.order_service.kafka;

import com.shopflow.order_service.event.PaymentEvent;
import com.shopflow.order_service.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentEventConsumer {

    private final OrderService orderService;

    @KafkaListener(topics = "payment.approved", groupId = "order-service-group")
    public void handlePaymentApproved(PaymentEvent event) {
        log.info("Recibido payment.approved para orden: {}", event.getOrderId());
        orderService.handlePaymentApproved(event);
    }

    @KafkaListener(topics = "payment.failed", groupId = "order-service-group")
    public void handlePaymentFailed(PaymentEvent event) {
        log.info("Recibido payment.failed para orden: {}", event.getOrderId());
        orderService.handlePaymentFailed(event);
    }
}