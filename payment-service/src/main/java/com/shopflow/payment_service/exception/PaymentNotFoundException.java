package com.shopflow.payment_service.exception;

public class PaymentNotFoundException extends RuntimeException {
    public PaymentNotFoundException(String id) {
        super("Pago no encontrado: " + id);
    }
}