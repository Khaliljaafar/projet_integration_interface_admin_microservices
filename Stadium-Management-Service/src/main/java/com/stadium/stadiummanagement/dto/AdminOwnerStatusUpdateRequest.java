package com.stadium.stadiummanagement.dto;

import com.stadium.stadiummanagement.domain.RequestStatus;

import jakarta.validation.constraints.NotNull;

public class AdminOwnerStatusUpdateRequest {

    @NotNull
    private RequestStatus status;

    public AdminOwnerStatusUpdateRequest() {
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }
}
