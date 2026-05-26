package com.shopflow.catalog_service.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariant {

    private String id;
    private String name;    // ej: "Talla L", "Color Rojo"
    private String value;   // ej: "L", "Rojo"
    private double price;   // precio específico de esta variante
    private int stock;      // stock de esta variante
}