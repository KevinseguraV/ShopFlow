package com.shopflow.inventory_service.dto;

import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class UpdateInventoryRequest {

    @Min(value = 0, message = "La cantidad no puede ser negativa")
    private int quantity;

    private Integer lowStockThreshold;
}