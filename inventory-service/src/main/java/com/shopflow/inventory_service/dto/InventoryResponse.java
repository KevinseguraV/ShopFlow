package com.shopflow.inventory_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryResponse {

    private String id;
    private String productId;
    private String variantId;
    private String productName;
    private int quantity;
    private int reservedQuantity;
    private int availableQuantity;
    private String updatedAt;
}