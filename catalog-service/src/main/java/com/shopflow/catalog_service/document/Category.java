package com.shopflow.catalog_service.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "categories")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    @Id
    private String id;
    private String name;
    private String description;
    private String slug;
}