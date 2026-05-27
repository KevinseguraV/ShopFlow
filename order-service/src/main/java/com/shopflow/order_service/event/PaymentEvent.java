package com.shopflow.order_service.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentEvent {

    private String orderId;
    private String paymentId;
    private String status; // APPROVED, FAILED
    private String reason;
}