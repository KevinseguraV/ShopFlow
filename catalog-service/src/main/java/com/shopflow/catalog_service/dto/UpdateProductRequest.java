package com.shopflow.catalog_service.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.Data;

import java.util.List;

@Data
public class UpdateProductRequest {

    private String name;
    private String description;

    @Min(value = 0, message = "El precio no puede ser negativo")
    private Double basePrice;

    private String categoryId;
    private List<String> images;

    @Valid
    private List<ProductVariantDto> variants;

    private Boolean active;
}