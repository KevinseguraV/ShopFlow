package com.shopflow.cart_service.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Cart {

    private String userId;

    @Builder.Default
    private List<CartItem> items = new ArrayList<>();

    private int totalItems;
    private BigDecimal totalPrice;
    private Instant updatedAt;

    public void recalculate() {
        this.totalItems = items.stream()
                .mapToInt(CartItem::getQuantity)
                .sum();
        this.totalPrice = items.stream()
                .map(CartItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        this.updatedAt = Instant.now();
    }
}