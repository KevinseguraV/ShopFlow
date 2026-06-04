package com.shopflow.inventory_service.kafka;

import com.shopflow.inventory_service.event.InventoryFailedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class InventoryEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishInventoryFailed(InventoryFailedEvent event) {
        log.info("Publicando inventory.failed para orden: {}", event.getOrderId());
        kafkaTemplate.send("inventory.failed", event.getOrderId(), event);
    }
}