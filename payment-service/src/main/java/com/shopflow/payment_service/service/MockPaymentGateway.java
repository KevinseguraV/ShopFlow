package com.shopflow.payment_service.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Random;
import java.util.UUID;

@Component
public class MockPaymentGateway implements PaymentGateway {

    @Value("${payment.mock.success-rate:0.8}")
    private double successRate;

    private final Random random = new Random();

    @Override
    public PaymentGatewayResult process(String orderId, BigDecimal amount,
                                        String currency, String description) {
        boolean success = random.nextDouble() < successRate;

        if (success) {
            return new PaymentGatewayResult(
                    true,
                    "MOCK-TXN-" + UUID.randomUUID().toString()
                            .substring(0, 8).toUpperCase(),
                    "Pago procesado exitosamente"
            );
        } else {
            return new PaymentGatewayResult(
                    false,
                    null,
                    "Fondos insuficientes"
            );
        }
    }
}