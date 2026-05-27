package com.shopflow.order_service.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OrderItemRequest {

    @NotBlank(message = "El productId es obligatorio")
    private String productId;

    @NotBlank(message = "El nombre del producto es obligatorio")
    private String productName;

    private String variantId;

    @Min(value = 1, message = "La cantidad mínima es 1")
    private int quantity;

    @Min(value = 0, message = "El precio no puede ser negativo")
    private double unitPrice;
}