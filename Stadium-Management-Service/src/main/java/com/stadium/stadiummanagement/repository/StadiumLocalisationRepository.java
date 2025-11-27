package com.stadium.stadiummanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.stadium.stadiummanagement.domain.StadiumLocalisation;

public interface StadiumLocalisationRepository extends JpaRepository<StadiumLocalisation, Long> {
}
