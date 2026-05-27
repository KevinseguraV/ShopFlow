package com.shopflow.payment_service.service;

import java.math.BigDecimal;

public interface PaymentGateway {

    PaymentGatewayResult process(String orderId, BigDecimal amount,
                                 String currency, String description);

    class PaymentGatewayResult {

        private final boolean success;
        private final String transactionId;
        private final String gatewayResponse;

        public PaymentGatewayResult(boolean success, String transactionId,
                                    String gatewayResponse) {
            this.success = success;
            this.transactionId = transactionId;
            this.gatewayResponse = gatewayResponse;
        }

        public boolean success() { return success; }
        public String transactionId() { return transactionId; }
        public String gatewayResponse() { return gatewayResponse; }
    }
}