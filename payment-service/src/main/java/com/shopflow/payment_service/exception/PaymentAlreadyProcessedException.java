package com.shopflow.payment_service.exception;

public class PaymentAlreadyProcessedException extends RuntimeException {
    public PaymentAlreadyProcessedException(String id) {
        super("El pago ya fue procesado: " + id);
    }
}