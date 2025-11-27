package com.stadium.stadiummanagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.stadium.stadiummanagement.domain.Stadium;

public interface StadiumRepository extends JpaRepository<Stadium, Long> {

    List<Stadium> findByTypeIgnoreCase(String type);
}
