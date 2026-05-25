package com.shopflow.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()

                .route("auth-service", r -> r
                        .path("/api/auth/**")
                        .uri("http://localhost:8081"))

                .route("catalog-service", r -> r
                        .path("/api/catalog/**")
                        .uri("http://localhost:8082"))

                .route("cart-service", r -> r
                        .path("/api/cart/**")
                        .uri("http://localhost:8083"))

                .route("order-service", r -> r
                        .path("/api/orders/**")
                        .uri("http://localhost:8084"))

                .route("payment-service", r -> r
                        .path("/api/payments/**")
                        .uri("http://localhost:8085"))

                .route("inventory-service", r -> r
                        .path("/api/inventory/**")
                        .uri("http://localhost:8086"))

                .build();
    }
}