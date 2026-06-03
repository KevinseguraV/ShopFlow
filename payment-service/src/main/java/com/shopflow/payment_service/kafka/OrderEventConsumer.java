package com.shopflow.payment_service.kafka;

import com.shopflow.payment_service.event.OrderCreatedEvent;
import com.shopflow.payment_service.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class OrderEventConsumer {

    private final PaymentService paymentService;

    @KafkaListener(
            topics = "${kafka.topics.order-created}",
            groupId = "${spring.kafka.consumer.group-id}"
    )
    public void handleOrderCreated(OrderCreatedEvent event) {
        log.info("Recibido order.created para orden: {}", event.getOrderId());
        try {
            paymentService.processPayment(event);
        } catch (Exception e) {
            log.error("Error procesando pago para orden {}: {}",
                    event.getOrderId(), e.getMessage(), e);
        }
    }
}