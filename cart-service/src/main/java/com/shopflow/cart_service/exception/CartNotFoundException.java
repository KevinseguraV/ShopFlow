package com.shopflow.cart_service.exception;

public class CartNotFoundException extends RuntimeException {
    public CartNotFoundException(String userId) {
        super("Carrito no encontrado para el usuario: " + userId);
    }
}