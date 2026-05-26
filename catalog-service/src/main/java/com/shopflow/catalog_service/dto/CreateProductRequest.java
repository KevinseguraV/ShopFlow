package com.shopflow.catalog_service.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CreateProductRequest {

    @NotBlank(message = "El nombre es obligatorio")
    private String name;

    @NotBlank(message = "La descripción es obligatoria")
    private String description;

    @NotNull(message = "El precio es obligatorio")
    @Min(value = 0, message = "El precio no puede ser negativo")
    private Double basePrice;

    @NotBlank(message = "La categoría es obligatoria")
    private String categoryId;

    private List<String> images;

    @Valid
    private List<ProductVariantDto> variants;
}