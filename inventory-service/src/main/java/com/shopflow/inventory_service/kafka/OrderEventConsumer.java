package com.shopflow.inventory_service.kafka;

import com.shopflow.inventory_service.event.OrderConfirmedEvent;
import com.shopflow.inventory_service.event.OrderCreatedEvent;
import com.shopflow.inventory_service.service.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderEventConsumer {

    private final InventoryService inventoryService;

    @KafkaListener(
            topics = "order.created",
            groupId = "inventory-service-group",
            properties = {"spring.json.value.default.type=com.shopflow.inventory_service.event.OrderCreatedEvent"}
    )
    public void handleOrderCreated(OrderCreatedEvent event) {
        log.info("Recibido order.created para orden: {}", event.getOrderId());
        inventoryService.reserveStock(event);
    }

    @KafkaListener(
            topics = "order.confirmed",
            groupId = "inventory-service-group",
            properties = {"spring.json.value.default.type=com.shopflow.inventory_service.event.OrderConfirmedEvent"}
    )
    public void handleOrderConfirmed(OrderConfirmedEvent event) {
        log.info("Recibido order.confirmed para orden: {}", event.getOrderId());
        inventoryService.deductStock(event);
    }

    @KafkaListener(
            topics = "order.cancelled",
            groupId = "inventory-service-group",
            properties = {"spring.json.value.default.type=com.shopflow.inventory_service.event.OrderConfirmedEvent"}
    )
    public void handleOrderCancelled(OrderConfirmedEvent event) {
        log.info("Recibido order.cancelled para orden: {}", event.getOrderId());
        inventoryService.releaseStock(event);
    }
}