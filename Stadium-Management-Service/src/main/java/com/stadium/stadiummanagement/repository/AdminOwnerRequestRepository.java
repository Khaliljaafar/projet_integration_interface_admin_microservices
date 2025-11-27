package com.stadium.stadiummanagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.stadium.stadiummanagement.domain.AdminOwnerRequest;
import com.stadium.stadiummanagement.domain.RequestStatus;

public interface AdminOwnerRequestRepository extends JpaRepository<AdminOwnerRequest, Long> {

    List<AdminOwnerRequest> findByStatus(RequestStatus status);

    List<AdminOwnerRequest> findByAdminId(Long adminId);

    List<AdminOwnerRequest> findByUserId(Long userId);
}
