package com.shopflow.inventory_service.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateInventoryRequest {

    @NotBlank(message = "El productId es obligatorio")
    private String productId;

    private String variantId;

    @NotBlank(message = "El nombre del producto es obligatorio")
    private String productName;

    @Min(value = 0, message = "La cantidad no puede ser negativa")
    private int quantity;
}