package com.shopflow.payment_service.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentApprovedEvent {
    private String orderId;
    private String paymentId;
    private String transactionId;
    private BigDecimal amount;
    private String currency;
    private LocalDateTime processedAt;
}