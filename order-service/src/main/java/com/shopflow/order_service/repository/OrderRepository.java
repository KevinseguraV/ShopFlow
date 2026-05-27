package com.shopflow.order_service.repository;

import com.shopflow.order_service.entity.Order;
import com.shopflow.order_service.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

    Page<Order> findByUserId(String userId, Pageable pageable);

    List<Order> findByUserIdAndStatus(String userId, OrderStatus status);
}