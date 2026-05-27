package com.shopflow.order_service.dto;

import com.shopflow.order_service.entity.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    private String id;
    private String userId;
    private OrderStatus status;
    private List<ItemResponse> items;
    private double totalAmount;
    private String shippingAddress;
    private String paymentId;
    private String failureReason;
    private String createdAt;
    private String updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItemResponse {
        private String id;
        private String productId;
        private String productName;
        private String variantId;
        private int quantity;
        private double unitPrice;
        private double totalPrice;
    }
}