package com.shopflow.cart_service.dto;

import com.shopflow.cart_service.document.CartItem;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@Builder
public class CartResponse {

    private String userId;
    private List<CartItem> items;
    private int totalItems;
    private BigDecimal totalPrice;
    private Instant updatedAt;
}