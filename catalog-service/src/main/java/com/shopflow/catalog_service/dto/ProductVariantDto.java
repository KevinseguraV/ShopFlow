package com.shopflow.catalog_service.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProductVariantDto {

    @NotBlank(message = "El nombre de la variante es obligatorio")
    private String name;

    @NotBlank(message = "El valor de la variante es obligatorio")
    private String value;

    @Min(value = 0, message = "El precio no puede ser negativo")
    private double price;

    @Min(value = 0, message = "El stock no puede ser negativo")
    private int stock;
}