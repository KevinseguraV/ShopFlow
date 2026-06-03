package com.shopflow.payment_service.kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${kafka.topics.payment-approved}")
    private String paymentApprovedTopic;

    @Value("${kafka.topics.payment-failed}")
    private String paymentFailedTopic;

    public void publishPaymentApproved(String orderId, String paymentId) {
        log.info("Publicando payment.approved para orden: {}", orderId);
        Map<String, String> event = Map.of(
                "orderId", orderId,
                "paymentId", paymentId,
                "status", "APPROVED",
                "reason", ""
        );
        kafkaTemplate.send(paymentApprovedTopic, orderId, event);
    }

    public void publishPaymentFailed(String orderId, String paymentId, String reason) {
        log.info("Publicando payment.failed para orden: {}", orderId);
        Map<String, String> event = Map.of(
                "orderId", orderId,
                "paymentId", paymentId,
                "status", "FAILED",
                "reason", reason != null ? reason : "Pago rechazado"
        );
        kafkaTemplate.send(paymentFailedTopic, orderId, event);
    }
}