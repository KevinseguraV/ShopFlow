package com.shopflow.notification_service.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderEvent {

    private String orderId;
    private String userId;
    private String userEmail;
    private String status;
    private double totalAmount;
    private String shippingAddress;
    private String paymentId;
    private String failureReason;
    private List<OrderItemEvent> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemEvent {
        private String productId;
        private String productName;
        private String variantId;
        private int quantity;
        private double unitPrice;
    }
}