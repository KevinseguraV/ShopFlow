package com.shopflow.inventory_service.controller;

import com.shopflow.inventory_service.dto.CreateInventoryRequest;
import com.shopflow.inventory_service.dto.InventoryResponse;
import com.shopflow.inventory_service.dto.UpdateInventoryRequest;
import com.shopflow.inventory_service.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @PostMapping
    public ResponseEntity<InventoryResponse> createInventory(
            @Valid @RequestBody CreateInventoryRequest request,
            @RequestHeader(value = "X-User-Role", defaultValue = "") String userRole) {
        if (!userRole.equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(inventoryService.createInventory(request));
    }

    @PutMapping("/{productId}")
    public ResponseEntity<InventoryResponse> updateStock(
            @PathVariable String productId,
            @Valid @RequestBody UpdateInventoryRequest request,
            @RequestHeader(value = "X-User-Role", defaultValue = "") String userRole) {
        if (!userRole.equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(inventoryService.updateStock(productId, request));
    }

    @GetMapping
    public ResponseEntity<List<InventoryResponse>> getAllInventory() {
        return ResponseEntity.ok(inventoryService.getAllInventory());
    }

    @GetMapping("/{productId}")
    public ResponseEntity<InventoryResponse> getInventoryByProductId(
            @PathVariable String productId) {
        return ResponseEntity.ok(inventoryService.getInventoryByProductId(productId));
    }
}