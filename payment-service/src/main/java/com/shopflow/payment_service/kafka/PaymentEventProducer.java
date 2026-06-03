package com.shopflow.payment_service.kafka;

import com.shopflow.payment_service.event.PaymentApprovedEvent;
import com.shopflow.payment_service.event.PaymentFailedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${kafka.topics.payment-approved}")
    private String paymentApprovedTopic;

    @Value("${kafka.topics.payment-failed}")
    private String paymentFailedTopic;

    public void publishPaymentApproved(PaymentApprovedEvent event) {
        log.info("Publicando payment.approved para orden: {}", event.getOrderId());
        // Enviamos sin type headers para que el consumer use su propio default type
        Message<PaymentApprovedEvent> message = MessageBuilder
                .withPayload(event)
                .setHeader(KafkaHeaders.TOPIC, paymentApprovedTopic)
                .setHeader(KafkaHeaders.KEY, event.getOrderId())
                .setHeader("__TypeId__", "")
                .build();
        kafkaTemplate.send(message);
    }

    public void publishPaymentFailed(PaymentFailedEvent event) {
        log.info("Publicando payment.failed para orden: {}", event.getOrderId());
        Message<PaymentFailedEvent> message = MessageBuilder
                .withPayload(event)
                .setHeader(KafkaHeaders.TOPIC, paymentFailedTopic)
                .setHeader(KafkaHeaders.KEY, event.getOrderId())
                .setHeader("__TypeId__", "")
                .build();
        kafkaTemplate.send(message);
    }
}