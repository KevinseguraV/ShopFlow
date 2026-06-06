package com.shopflow.inventory_service.service;

import com.shopflow.inventory_service.dto.CreateInventoryRequest;
import com.shopflow.inventory_service.dto.InventoryResponse;
import com.shopflow.inventory_service.dto.UpdateInventoryRequest;
import com.shopflow.inventory_service.entity.InventoryItem;
import com.shopflow.inventory_service.entity.StockMovement;
import com.shopflow.inventory_service.event.InventoryFailedEvent;
import com.shopflow.inventory_service.event.OrderCreatedEvent;
import com.shopflow.inventory_service.event.OrderConfirmedEvent;
import com.shopflow.inventory_service.exception.InventoryException;
import com.shopflow.inventory_service.kafka.InventoryEventProducer;
import com.shopflow.inventory_service.repository.InventoryRepository;
import com.shopflow.inventory_service.repository.StockMovementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final StockMovementRepository stockMovementRepository;
    private final InventoryEventProducer eventProducer;

    @Transactional
    public InventoryResponse createInventory(CreateInventoryRequest request) {
        if (inventoryRepository.findByProductId(request.getProductId()).isPresent()) {
            throw new InventoryException(
                    "Ya existe inventario para este producto", HttpStatus.CONFLICT);
        }

        InventoryItem item = InventoryItem.builder()
                .productId(request.getProductId())
                .variantId(request.getVariantId())
                .productName(request.getProductName())
                .quantity(request.getQuantity())
                .reservedQuantity(0)
                .build();

        return toResponse(inventoryRepository.save(item));
    }

    // ── Actualiza stock de un producto existente ──────────────────────────────
    @Transactional
    public InventoryResponse updateStock(String productId, UpdateInventoryRequest request) {
        InventoryItem item = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new InventoryException(
                        "Inventario no encontrado", HttpStatus.NOT_FOUND));

        item.setQuantity(request.getQuantity());
        if (request.getLowStockThreshold() != null) {
            item.setLowStockThreshold(request.getLowStockThreshold());
        }

        log.info("Stock actualizado — producto: {}, nueva cantidad: {}",
                productId, request.getQuantity());

        return toResponse(inventoryRepository.save(item));
    }

    public List<InventoryResponse> getAllInventory() {
        return inventoryRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public InventoryResponse getInventoryByProductId(String productId) {
        return toResponse(inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new InventoryException(
                        "Inventario no encontrado", HttpStatus.NOT_FOUND)));
    }

    // Escucha order.created — reserva stock
    @Transactional
    public void reserveStock(OrderCreatedEvent event) {
        if (stockMovementRepository.existsByOrderIdAndType(
                event.getOrderId(), "RESERVE")) {
            log.warn("Stock ya reservado para orden: {}", event.getOrderId());
            return;
        }

        for (OrderCreatedEvent.OrderItemEvent item : event.getItems()) {
            InventoryItem inventory = inventoryRepository
                    .findByProductId(item.getProductId())
                    .orElse(null);

            if (inventory == null) {
                log.warn("Producto no encontrado en inventario: {}", item.getProductId());
                eventProducer.publishInventoryFailed(InventoryFailedEvent.builder()
                        .orderId(event.getOrderId())
                        .productId(item.getProductId())
                        .reason("Producto no encontrado en inventario")
                        .build());
                return;
            }

            if (inventory.getAvailableQuantity() < item.getQuantity()) {
                log.warn("Stock insuficiente para producto: {}", item.getProductId());
                eventProducer.publishInventoryFailed(InventoryFailedEvent.builder()
                        .orderId(event.getOrderId())
                        .productId(item.getProductId())
                        .reason("Stock insuficiente: disponible=" +
                                inventory.getAvailableQuantity() +
                                ", solicitado=" + item.getQuantity())
                        .build());
                return;
            }

            inventory.setReservedQuantity(
                    inventory.getReservedQuantity() + item.getQuantity());
            inventoryRepository.save(inventory);

            stockMovementRepository.save(StockMovement.builder()
                    .productId(item.getProductId())
                    .variantId(item.getVariantId())
                    .orderId(event.getOrderId())
                    .quantity(item.getQuantity())
                    .type("RESERVE")
                    .build());

            log.info("Stock reservado — producto: {}, cantidad: {}",
                    item.getProductId(), item.getQuantity());
        }
    }

    // Escucha order.confirmed — descuenta stock definitivamente
    @Transactional
    public void deductStock(OrderConfirmedEvent event) {
        if (stockMovementRepository.existsByOrderIdAndType(
                event.getOrderId(), "DEDUCT")) {
            log.warn("Stock ya descontado para orden: {}", event.getOrderId());
            return;
        }

        List<StockMovement> reservations = stockMovementRepository
                .findByOrderId(event.getOrderId());

        for (StockMovement reservation : reservations) {
            if (!reservation.getType().equals("RESERVE")) continue;

            InventoryItem inventory = inventoryRepository
                    .findByProductId(reservation.getProductId())
                    .orElse(null);

            if (inventory == null) continue;

            inventory.setQuantity(inventory.getQuantity() - reservation.getQuantity());
            inventory.setReservedQuantity(
                    inventory.getReservedQuantity() - reservation.getQuantity());
            inventoryRepository.save(inventory);

            stockMovementRepository.save(StockMovement.builder()
                    .productId(reservation.getProductId())
                    .variantId(reservation.getVariantId())
                    .orderId(event.getOrderId())
                    .quantity(reservation.getQuantity())
                    .type("DEDUCT")
                    .build());

            log.info("Stock descontado — producto: {}, cantidad: {}",
                    reservation.getProductId(), reservation.getQuantity());
        }
    }

    // Escucha order.cancelled — libera stock reservado
    @Transactional
    public void releaseStock(OrderConfirmedEvent event) {
        List<StockMovement> reservations = stockMovementRepository
                .findByOrderId(event.getOrderId());

        for (StockMovement reservation : reservations) {
            if (!reservation.getType().equals("RESERVE")) continue;

            InventoryItem inventory = inventoryRepository
                    .findByProductId(reservation.getProductId())
                    .orElse(null);

            if (inventory == null) continue;

            inventory.setReservedQuantity(
                    inventory.getReservedQuantity() - reservation.getQuantity());
            inventoryRepository.save(inventory);

            stockMovementRepository.save(StockMovement.builder()
                    .productId(reservation.getProductId())
                    .variantId(reservation.getVariantId())
                    .orderId(event.getOrderId())
                    .quantity(reservation.getQuantity())
                    .type("RELEASE")
                    .build());

            log.info("Stock liberado — producto: {}, cantidad: {}",
                    reservation.getProductId(), reservation.getQuantity());
        }
    }

    private InventoryResponse toResponse(InventoryItem item) {
        return InventoryResponse.builder()
                .id(item.getId())
                .productId(item.getProductId())
                .variantId(item.getVariantId())
                .productName(item.getProductName())
                .quantity(item.getQuantity())
                .reservedQuantity(item.getReservedQuantity())
                .availableQuantity(item.getAvailableQuantity())
                .lowStockThreshold(item.getLowStockThreshold())
                .updatedAt(item.getUpdatedAt().toString())
                .build();
    }
}