package com.shopflow.cart_service.dto;

import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class UpdateItemRequest {

    @Min(value = 1, message = "La cantidad mínima es 1")
    private int quantity;
}