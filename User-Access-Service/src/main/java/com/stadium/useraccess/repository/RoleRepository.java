package com.stadium.useraccess.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.stadium.useraccess.domain.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {

    boolean existsByLabelIgnoreCase(String label);

    Optional<Role> findByLabelIgnoreCase(String label);
}
