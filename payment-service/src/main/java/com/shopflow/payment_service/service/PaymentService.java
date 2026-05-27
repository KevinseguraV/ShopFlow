package com.shopflow.payment_service.service;

import com.shopflow.payment_service.dto.CreatePaymentRequest;
import com.shopflow.payment_service.dto.PaymentResponse;
import com.shopflow.payment_service.entity.Payment;
import com.shopflow.payment_service.enums.PaymentStatus;
import com.shopflow.payment_service.exception.PaymentAlreadyProcessedException;
import com.shopflow.payment_service.exception.PaymentNotFoundException;
import com.shopflow.payment_service.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentGateway paymentGateway;

    @Value("${payment.currency.default:COP}")
    private String defaultCurrency;

    @Transactional
    public PaymentResponse createPayment(String userId, CreatePaymentRequest request) {
        String currency = request.getCurrency() != null
                ? request.getCurrency() : defaultCurrency;

        Payment payment = Payment.builder()
                .orderId(request.getOrderId())
                .userId(userId)
                .amount(request.getAmount())
                .currency(currency)
                .status(PaymentStatus.PENDING)
                .description(request.getDescription())
                .build();

        payment = paymentRepository.save(payment);

        PaymentGateway.PaymentGatewayResult result = paymentGateway.process(
                request.getOrderId(),
                request.getAmount(),
                currency,
                request.getDescription()
        );

        payment.setStatus(result.success()
                ? PaymentStatus.COMPLETED
                : PaymentStatus.FAILED);
        payment.setGatewayTransactionId(result.transactionId());
        payment.setGatewayResponse(result.gatewayResponse());
        payment = paymentRepository.save(payment);

        return toResponse(payment);
    }

    public PaymentResponse getPayment(String paymentId) {
        return toResponse(findById(paymentId));
    }

    public List<PaymentResponse> getPaymentsByOrder(String orderId) {
        return paymentRepository.findByOrderId(orderId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<PaymentResponse> getMyPayments(String userId) {
        return paymentRepository.findByUserId(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public PaymentResponse cancelPayment(String paymentId) {
        Payment payment = findById(paymentId);

        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw new PaymentAlreadyProcessedException(paymentId);
        }

        payment.setStatus(PaymentStatus.CANCELLED);
        payment.setGatewayResponse("Cancelado por el usuario");
        return toResponse(paymentRepository.save(payment));
    }

    private Payment findById(String id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new PaymentNotFoundException(id));
    }

    private PaymentResponse toResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .orderId(payment.getOrderId())
                .userId(payment.getUserId())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .status(payment.getStatus())
                .description(payment.getDescription())
                .gatewayTransactionId(payment.getGatewayTransactionId())
                .gatewayResponse(payment.getGatewayResponse())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }
}