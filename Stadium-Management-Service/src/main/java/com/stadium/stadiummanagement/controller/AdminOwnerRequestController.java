package com.stadium.stadiummanagement.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.stadium.stadiummanagement.domain.RequestStatus;
import com.stadium.stadiummanagement.dto.AdminOwnerRequestDto;
import com.stadium.stadiummanagement.dto.AdminOwnerResponse;
import com.stadium.stadiummanagement.dto.AdminOwnerStatusUpdateRequest;
import com.stadium.stadiummanagement.service.AdminOwnerRequestService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/owner-requests")
public class AdminOwnerRequestController {

    private final AdminOwnerRequestService adminOwnerRequestService;

    public AdminOwnerRequestController(AdminOwnerRequestService adminOwnerRequestService) {
        this.adminOwnerRequestService = adminOwnerRequestService;
    }

    @PostMapping
    public ResponseEntity<AdminOwnerResponse> submitRequest(@Valid @RequestBody AdminOwnerRequestDto dto) {
        AdminOwnerResponse response = adminOwnerRequestService.submitRequest(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{requestId}/status")
    public AdminOwnerResponse updateStatus(@PathVariable Long requestId,
            @Valid @RequestBody AdminOwnerStatusUpdateRequest request) {
        return adminOwnerRequestService.updateStatus(requestId, request);
    }

    @GetMapping
    public List<AdminOwnerResponse> listRequests(@RequestParam(name = "status", required = false) RequestStatus status,
            @RequestParam(name = "adminId", required = false) Long adminId,
            @RequestParam(name = "userId", required = false) Long userId) {
        return adminOwnerRequestService.listRequests(status, adminId, userId);
    }

    @GetMapping("/{requestId}")
    public AdminOwnerResponse getRequest(@PathVariable Long requestId) {
        return adminOwnerRequestService.getRequest(requestId);
    }
}
