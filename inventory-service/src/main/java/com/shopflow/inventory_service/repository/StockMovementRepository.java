package com.shopflow.inventory_service.repository;

import com.shopflow.inventory_service.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, String> {

    List<StockMovement> findByOrderId(String orderId);

    boolean existsByOrderIdAndType(String orderId, String type);
}