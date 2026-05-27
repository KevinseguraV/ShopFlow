package com.shopflow.payment_service.service;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.UUID;

@Component
public class MockPaymentGateway implements PaymentGateway {

    @Override
    public PaymentGatewayResult process(String orderId, BigDecimal amount,
                                        String currency, String description) {
        boolean success = amount.toBigInteger()
                .mod(BigInteger.TWO)
                .equals(BigInteger.ZERO);

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