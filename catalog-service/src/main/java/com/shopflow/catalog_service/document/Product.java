package com.shopflow.catalog_service.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "products")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    private String id;

    @Indexed(unique = true)
    private String slug;        // ej: "camiseta-nike-roja"

    private String name;
    private String description;
    private double basePrice;
    private String categoryId;
    private String categoryName;
    private List<String> images;
    private List<ProductVariant> variants;
    private double rating;
    private int reviewCount;
    private boolean active;
    private Instant createdAt;
    private Instant updatedAt;
}