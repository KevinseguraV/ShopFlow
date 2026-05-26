package com.shopflow.catalog_service.repository;

import com.shopflow.catalog_service.document.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {

    Optional<Product> findBySlug(String slug);

    Page<Product> findByActiveTrue(Pageable pageable);

    Page<Product> findByCategoryIdAndActiveTrue(String categoryId, Pageable pageable);

    @Query("{ 'active': true, $or: [ { 'name': { $regex: ?0, $options: 'i' } }, { 'description': { $regex: ?0, $options: 'i' } } ] }")
    Page<Product> searchByNameOrDescription(String query, Pageable pageable);

    boolean existsBySlug(String slug);
}