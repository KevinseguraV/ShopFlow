package com.shopflow.order_service.exception;

import org.springframework.http.HttpStatus;

public class OrderException extends RuntimeException {

    private final HttpStatus status;

    public OrderException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}