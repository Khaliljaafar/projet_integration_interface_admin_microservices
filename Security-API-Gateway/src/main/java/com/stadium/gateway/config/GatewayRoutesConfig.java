package com.stadium.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayRoutesConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("user-access", r -> r.path("/api/users/**", "/api/auth/**", "/api/roles/**")
                        .uri("lb://user-access-service"))
                .route("stadium-management", r -> r.path("/api/stadiums/**", "/api/owner-requests/**")
                        .uri("lb://stadium-management-service"))
                .route("reservations", r -> r.path("/api/reservations/**")
                        .uri("lb://reservation-service"))
                .route("feedback", r -> r.path("/api/feedback/**")
                        .uri("lb://feedback-rating-service"))
                .route("notifications", r -> r.path("/api/notifications/**")
                        .uri("lb://notification-service"))
                .route("reporting", r -> r.path("/api/reporting/**")
                        .uri("lb://reporting-dashboard-service"))
                .route("reporting", r -> r.path("/api/bans/**")
                        .uri("lb://ban-compliance-service"))
                .build();
    }
}
