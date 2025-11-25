package com.stadium.useraccess.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stadium.useraccess.domain.Role;
import com.stadium.useraccess.dto.RoleRequest;
import com.stadium.useraccess.dto.RoleResponse;
import com.stadium.useraccess.exception.DuplicateResourceException;
import com.stadium.useraccess.exception.ResourceNotFoundException;
import com.stadium.useraccess.repository.RoleRepository;

@Service
@Transactional
public class RoleService {

    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public RoleResponse createRole(RoleRequest request) {
        if (roleRepository.existsByLabelIgnoreCase(request.getLabel())) {
            throw new DuplicateResourceException("Role already exists: " + request.getLabel());
        }
        Role role = new Role();
        role.setLabel(request.getLabel());
        role.setDescription(request.getDescription());
        return RoleResponse.fromEntity(roleRepository.save(role));
    }

    @Transactional(readOnly = true)
    public List<RoleResponse> getRoles() {
        return roleRepository.findAll()
                .stream()
                .map(RoleResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Role getRoleOrThrow(Long roleId) {
        return roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleId));
    }
}
