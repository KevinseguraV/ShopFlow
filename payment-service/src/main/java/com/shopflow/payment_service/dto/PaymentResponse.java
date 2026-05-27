package com.shopflow.payment_service.dto;

import com.shopflow.payment_service.enums.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
public class PaymentResponse {

    private String id;
    private String orderId;
    private String userId;
    private BigDecimal amount;
    private String currency;
    private PaymentStatus status;
    private String description;
    private String gatewayTransactionId;
    private String gatewayResponse;
    private Instant createdAt;
    private Instant updatedAt;
}