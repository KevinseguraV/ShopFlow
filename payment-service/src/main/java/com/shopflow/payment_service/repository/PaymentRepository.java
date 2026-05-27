package com.shopflow.payment_service.repository;

import com.shopflow.payment_service.entity.Payment;
import com.shopflow.payment_service.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, String> {
    List<Payment> findByOrderId(String orderId);
    List<Payment> findByUserId(String userId);
    List<Payment> findByStatus(PaymentStatus status);
    Optional<Payment> findByGatewayTransactionId(String transactionId);
}