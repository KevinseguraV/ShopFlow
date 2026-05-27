package com.shopflow.cart_service.service;

import com.shopflow.cart_service.document.Cart;
import com.shopflow.cart_service.document.CartItem;
import com.shopflow.cart_service.dto.AddItemRequest;
import com.shopflow.cart_service.dto.CartResponse;
import com.shopflow.cart_service.dto.UpdateItemRequest;
import com.shopflow.cart_service.exception.CartNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class CartService {

    private final RedisTemplate<String, Cart> redisTemplate;

    @Value("${cart.ttl.seconds:604800}")
    private long cartTtl;

    private static final String KEY_PREFIX = "cart:";

    private String key(String userId) {
        return KEY_PREFIX + userId;
    }

    public CartResponse getCart(String userId) {
        Cart cart = redisTemplate.opsForValue().get(key(userId));
        if (cart == null) throw new CartNotFoundException(userId);
        return toResponse(cart);
    }

    public CartResponse addItem(String userId, AddItemRequest request) {
        Cart cart = getOrCreateCart(userId);

        cart.getItems().stream()
                .filter(i -> i.getProductId().equals(request.getProductId()))
                .findFirst()
                .ifPresentOrElse(
                        existing -> {
                            int newQty = existing.getQuantity() + request.getQuantity();
                            existing.setQuantity(newQty);
                            existing.setSubtotal(
                                    existing.getUnitPrice().multiply(BigDecimal.valueOf(newQty)));
                        },
                        () -> cart.getItems().add(CartItem.builder()
                                .productId(request.getProductId())
                                .productName(request.getProductName())
                                .slug(request.getSlug())
                                .unitPrice(request.getUnitPrice())
                                .quantity(request.getQuantity())
                                .subtotal(request.getUnitPrice()
                                        .multiply(BigDecimal.valueOf(request.getQuantity())))
                                .build())
                );

        cart.recalculate();
        save(cart);
        return toResponse(cart);
    }

    public CartResponse updateItem(String userId, String productId, UpdateItemRequest request) {
        Cart cart = getOrCreateCart(userId);

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProductId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new CartNotFoundException(userId));

        item.setQuantity(request.getQuantity());
        item.setSubtotal(item.getUnitPrice().multiply(BigDecimal.valueOf(request.getQuantity())));

        cart.recalculate();
        save(cart);
        return toResponse(cart);
    }

    public CartResponse removeItem(String userId, String productId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().removeIf(i -> i.getProductId().equals(productId));
        cart.recalculate();
        save(cart);
        return toResponse(cart);
    }

    public void clearCart(String userId) {
        redisTemplate.delete(key(userId));
    }

    private Cart getOrCreateCart(String userId) {
        Cart cart = redisTemplate.opsForValue().get(key(userId));
        if (cart == null) {
            cart = Cart.builder()
                    .userId(userId)
                    .items(new ArrayList<>())
                    .totalItems(0)
                    .totalPrice(BigDecimal.ZERO)
                    .updatedAt(Instant.now())
                    .build();
        }
        return cart;
    }

    private void save(Cart cart) {
        redisTemplate.opsForValue().set(key(cart.getUserId()), cart, cartTtl, TimeUnit.SECONDS);
    }

    private CartResponse toResponse(Cart cart) {
        return CartResponse.builder()
                .userId(cart.getUserId())
                .items(cart.getItems())
                .totalItems(cart.getTotalItems())
                .totalPrice(cart.getTotalPrice())
                .updatedAt(cart.getUpdatedAt())
                .build();
    }
}