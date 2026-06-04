package com.shopflow.order_service.kafka;

import com.shopflow.order_service.event.InventoryFailedEvent;
import com.shopflow.order_service.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class InventoryEventConsumer {

    private final OrderService orderService;

    @KafkaListener(
            topics = "inventory.failed",
            groupId = "order-service-group",
            properties = {"spring.json.value.default.type=com.shopflow.order_service.event.InventoryFailedEvent"}
    )
    public void handleInventoryFailed(InventoryFailedEvent event) {
        log.info("Recibido inventory.failed para orden: {}", event.getOrderId());
        orderService.handleInventoryFailed(event);
    }
}