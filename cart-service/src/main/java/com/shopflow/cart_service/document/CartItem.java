package com.shopflow.cart_service.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {

    private String productId;
    private String productName;
    private String slug;
    private BigDecimal unitPrice;
    private int quantity;
    private BigDecimal subtotal;
}