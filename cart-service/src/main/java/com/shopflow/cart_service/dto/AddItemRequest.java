package com.shopflow.cart_service.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class AddItemRequest {

    @NotBlank(message = "El productId es obligatorio")
    private String productId;

    @NotBlank(message = "El nombre del producto es obligatorio")
    private String productName;

    @NotBlank(message = "El slug es obligatorio")
    private String slug;

    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor a 0")
    private BigDecimal unitPrice;

    @Min(value = 1, message = "La cantidad mínima es 1")
    private int quantity;
}