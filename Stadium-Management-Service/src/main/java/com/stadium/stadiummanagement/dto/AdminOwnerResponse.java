package com.stadium.stadiummanagement.dto;

import java.time.LocalDateTime;

import com.stadium.stadiummanagement.domain.AdminOwnerRequest;
import com.stadium.stadiummanagement.domain.RequestStatus;

public class AdminOwnerResponse {

    private Long id;
    private Long userId;
    private Long adminId;
    private Long stadiumId;
    private Long feedbackId;
    private RequestStatus status;
    private LocalDateTime createdAt;

    public AdminOwnerResponse() {
    }

    public static AdminOwnerResponse fromEntity(AdminOwnerRequest request) {
        AdminOwnerResponse response = new AdminOwnerResponse();
        response.setId(request.getId());
        response.setUserId(request.getUserId());
        response.setAdminId(request.getAdminId());
        response.setStadiumId(request.getStadium().getId());
        response.setFeedbackId(request.getFeedbackId());
        response.setStatus(request.getStatus());
        response.setCreatedAt(request.getCreatedAt());
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getAdminId() {
        return adminId;
    }

    public void setAdminId(Long adminId) {
        this.adminId = adminId;
    }

    public Long getStadiumId() {
        return stadiumId;
    }

    public void setStadiumId(Long stadiumId) {
        this.stadiumId = stadiumId;
    }

    public Long getFeedbackId() {
        return feedbackId;
    }

    public void setFeedbackId(Long feedbackId) {
        this.feedbackId = feedbackId;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
