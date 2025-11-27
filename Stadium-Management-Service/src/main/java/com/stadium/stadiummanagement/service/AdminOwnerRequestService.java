package com.stadium.stadiummanagement.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stadium.stadiummanagement.domain.AdminOwnerRequest;
import com.stadium.stadiummanagement.domain.RequestStatus;
import com.stadium.stadiummanagement.domain.Stadium;
import com.stadium.stadiummanagement.dto.AdminOwnerRequestDto;
import com.stadium.stadiummanagement.dto.AdminOwnerResponse;
import com.stadium.stadiummanagement.dto.AdminOwnerStatusUpdateRequest;
import com.stadium.stadiummanagement.exception.ResourceNotFoundException;
import com.stadium.stadiummanagement.repository.AdminOwnerRequestRepository;
import com.stadium.stadiummanagement.repository.StadiumRepository;

@Service
@Transactional
public class AdminOwnerRequestService {

    private final AdminOwnerRequestRepository adminOwnerRequestRepository;
    private final StadiumRepository stadiumRepository;

    public AdminOwnerRequestService(AdminOwnerRequestRepository adminOwnerRequestRepository,
            StadiumRepository stadiumRepository) {
        this.adminOwnerRequestRepository = adminOwnerRequestRepository;
        this.stadiumRepository = stadiumRepository;
    }

    public AdminOwnerResponse submitRequest(AdminOwnerRequestDto dto) {
        Stadium stadium = stadiumRepository.findById(dto.getStadiumId())
                .orElseThrow(() -> new ResourceNotFoundException("Stadium not found: " + dto.getStadiumId()));
        AdminOwnerRequest request = new AdminOwnerRequest();
        request.setAdminId(dto.getAdminId());
        request.setUserId(dto.getUserId());
        request.setStadium(stadium);
        request.setFeedbackId(dto.getFeedbackId());
        return AdminOwnerResponse.fromEntity(adminOwnerRequestRepository.save(request));
    }

    public AdminOwnerResponse updateStatus(Long requestId, AdminOwnerStatusUpdateRequest updateRequest) {
        AdminOwnerRequest request = findRequest(requestId);
        request.setStatus(updateRequest.getStatus());
        return AdminOwnerResponse.fromEntity(request);
    }

    @Transactional(readOnly = true)
    public AdminOwnerResponse getRequest(Long requestId) {
        return AdminOwnerResponse.fromEntity(findRequest(requestId));
    }

    @Transactional(readOnly = true)
    public List<AdminOwnerResponse> listRequests(RequestStatus status, Long adminId, Long userId) {
        if (status != null) {
            return adminOwnerRequestRepository.findByStatus(status).stream()
                    .map(AdminOwnerResponse::fromEntity)
                    .collect(Collectors.toList());
        }
        if (adminId != null) {
            return adminOwnerRequestRepository.findByAdminId(adminId).stream()
                    .map(AdminOwnerResponse::fromEntity)
                    .collect(Collectors.toList());
        }
        if (userId != null) {
            return adminOwnerRequestRepository.findByUserId(userId).stream()
                    .map(AdminOwnerResponse::fromEntity)
                    .collect(Collectors.toList());
        }
        return adminOwnerRequestRepository.findAll().stream()
                .map(AdminOwnerResponse::fromEntity)
                .collect(Collectors.toList());
    }

    private AdminOwnerRequest findRequest(Long requestId) {
        return adminOwnerRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner request not found: " + requestId));
    }
}
