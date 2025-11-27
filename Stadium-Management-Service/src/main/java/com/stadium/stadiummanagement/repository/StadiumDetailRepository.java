package com.stadium.stadiummanagement.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.stadium.stadiummanagement.domain.StadiumDetail;

public interface StadiumDetailRepository extends JpaRepository<StadiumDetail, Long> {

    Optional<StadiumDetail> findByNameIgnoreCase(String name);
}
