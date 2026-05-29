package com.shopflow.inventory_service.repository;

import com.shopflow.inventory_service.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<InventoryItem, String> {

    Optional<InventoryItem> findByProductId(String productId);

    Optional<InventoryItem> findByProductIdAndVariantId(String productId, String variantId);
}