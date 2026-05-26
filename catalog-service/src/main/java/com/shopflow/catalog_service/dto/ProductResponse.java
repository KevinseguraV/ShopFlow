package com.shopflow.catalog_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private String id;
    private String slug;
    private String name;
    private String description;
    private double basePrice;
    private String categoryId;
    private String categoryName;
    private List<String> images;
    private List<VariantResponse> variants;
    private double rating;
    private int reviewCount;
    private boolean active;
    private String createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VariantResponse {
        private String id;
        private String name;
        private String value;
        private double price;
        private int stock;
    }
}