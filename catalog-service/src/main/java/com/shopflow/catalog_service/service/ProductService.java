package com.shopflow.catalog_service.service;

import com.shopflow.catalog_service.document.Category;
import com.shopflow.catalog_service.document.Product;
import com.shopflow.catalog_service.document.ProductVariant;
import com.shopflow.catalog_service.dto.*;
import com.shopflow.catalog_service.exception.ProductException;
import com.shopflow.catalog_service.repository.CategoryRepository;
import com.shopflow.catalog_service.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public Page<ProductResponse> getProducts(int page, int size, String sort) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.DESC, sort));
        return productRepository.findByActiveTrue(pageable)
                .map(this::toResponse);
    }

    public Page<ProductResponse> getProductsByCategory(
            String categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.DESC, "createdAt"));
        return productRepository.findByCategoryIdAndActiveTrue(categoryId, pageable)
                .map(this::toResponse);
    }

    public Page<ProductResponse> searchProducts(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.searchByNameOrDescription(query, pageable)
                .map(this::toResponse);
    }

    public ProductResponse getProductById(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductException(
                        "Producto no encontrado", HttpStatus.NOT_FOUND));
        return toResponse(product);
    }

    public ProductResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ProductException(
                        "Producto no encontrado", HttpStatus.NOT_FOUND));
        return toResponse(product);
    }

    public ProductResponse createProduct(CreateProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ProductException(
                        "Categoría no encontrada", HttpStatus.NOT_FOUND));

        String slug = generateSlug(request.getName());
        if (productRepository.existsBySlug(slug)) {
            slug = slug + "-" + UUID.randomUUID().toString().substring(0, 4);
        }

        List<ProductVariant> variants = request.getVariants() != null
                ? request.getVariants().stream()
                .map(v -> ProductVariant.builder()
                        .id(UUID.randomUUID().toString())
                        .name(v.getName())
                        .value(v.getValue())
                        .price(v.getPrice())
                        .stock(v.getStock())
                        .build())
                .collect(Collectors.toList())
                : List.of();

        Product product = Product.builder()
                .slug(slug)
                .name(request.getName())
                .description(request.getDescription())
                .basePrice(request.getBasePrice())
                .categoryId(category.getId())
                .categoryName(category.getName())
                .images(request.getImages() != null ? request.getImages() : List.of())
                .variants(variants)
                .rating(0.0)
                .reviewCount(0)
                .active(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        return toResponse(productRepository.save(product));
    }

    public ProductResponse updateProduct(String id, UpdateProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductException(
                        "Producto no encontrado", HttpStatus.NOT_FOUND));

        if (request.getName() != null) product.setName(request.getName());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getBasePrice() != null) product.setBasePrice(request.getBasePrice());
        if (request.getImages() != null) product.setImages(request.getImages());
        if (request.getActive() != null) product.setActive(request.getActive());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ProductException(
                            "Categoría no encontrada", HttpStatus.NOT_FOUND));
            product.setCategoryId(category.getId());
            product.setCategoryName(category.getName());
        }

        if (request.getVariants() != null) {
            product.setVariants(request.getVariants().stream()
                    .map(v -> ProductVariant.builder()
                            .id(UUID.randomUUID().toString())
                            .name(v.getName())
                            .value(v.getValue())
                            .price(v.getPrice())
                            .stock(v.getStock())
                            .build())
                    .collect(Collectors.toList()));
        }

        product.setUpdatedAt(Instant.now());
        return toResponse(productRepository.save(product));
    }

    public void deleteProduct(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductException(
                        "Producto no encontrado", HttpStatus.NOT_FOUND));
        product.setActive(false);
        product.setUpdatedAt(Instant.now());
        productRepository.save(product);
    }

    public List<Category> getCategories() {
        return categoryRepository.findAll();
    }

    public Category createCategory(CategoryRequest request) {
        String slug = generateSlug(request.getName());
        if (categoryRepository.existsBySlug(slug)) {
            throw new ProductException("Categoría ya existe", HttpStatus.CONFLICT);
        }

        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .slug(slug)
                .build();

        return categoryRepository.save(category);
    }

    private String generateSlug(String name) {
        return name.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .trim();
    }

    private ProductResponse toResponse(Product product) {
        List<ProductResponse.VariantResponse> variants = product.getVariants() != null
                ? product.getVariants().stream()
                .map(v -> ProductResponse.VariantResponse.builder()
                        .id(v.getId())
                        .name(v.getName())
                        .value(v.getValue())
                        .price(v.getPrice())
                        .stock(v.getStock())
                        .build())
                .collect(Collectors.toList())
                : List.of();

        return ProductResponse.builder()
                .id(product.getId())
                .slug(product.getSlug())
                .name(product.getName())
                .description(product.getDescription())
                .basePrice(product.getBasePrice())
                .categoryId(product.getCategoryId())
                .categoryName(product.getCategoryName())
                .images(product.getImages())
                .variants(variants)
                .rating(product.getRating())
                .reviewCount(product.getReviewCount())
                .active(product.isActive())
                .createdAt(product.getCreatedAt() != null ?
                        product.getCreatedAt().toString() : null)
                .build();
    }
}