package com.shopflow.catalog_service.controller;

import com.shopflow.catalog_service.document.Category;
import com.shopflow.catalog_service.dto.*;
import com.shopflow.catalog_service.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/catalog")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // Productos
    @GetMapping("/products")
    public ResponseEntity<Page<ProductResponse>> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sort) {
        return ResponseEntity.ok(productService.getProducts(page, size, sort));
    }

    @GetMapping("/products/search")
    public ResponseEntity<Page<ProductResponse>> searchProducts(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(productService.searchProducts(query, page, size));
    }

    @GetMapping("/products/category/{categoryId}")
    public ResponseEntity<Page<ProductResponse>> getProductsByCategory(
            @PathVariable String categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(
                productService.getProductsByCategory(categoryId, page, size));
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable String id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/products/slug/{slug}")
    public ResponseEntity<ProductResponse> getProductBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(productService.getProductBySlug(slug));
    }

    @PostMapping("/products")
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody CreateProductRequest request,
            @RequestHeader(value = "X-User-Role", defaultValue = "") String userRole) {
        if (!userRole.equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(productService.createProduct(request));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable String id,
            @Valid @RequestBody UpdateProductRequest request,
            @RequestHeader(value = "X-User-Role", defaultValue = "") String userRole) {
        if (!userRole.equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable String id,
            @RequestHeader(value = "X-User-Role", defaultValue = "") String userRole) {
        if (!userRole.equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // Categorías
    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(productService.getCategories());
    }

    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(
            @Valid @RequestBody CategoryRequest request,
            @RequestHeader(value = "X-User-Role", defaultValue = "") String userRole) {
        if (!userRole.equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(productService.createCategory(request));
    }
}