package com.shopflow.order_service.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {

    @NotEmpty(message = "La orden debe tener al menos un producto")
    @Valid
    private List<OrderItemRequest> items;

    @NotBlank(message = "La dirección de envío es obligatoria")
    private String shippingAddress;
}