package com.stadium.useraccess.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stadium.useraccess.dto.RoleRequest;
import com.stadium.useraccess.dto.RoleResponse;
import com.stadium.useraccess.service.RoleService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/roles")
@Validated
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @PostMapping
    public ResponseEntity<RoleResponse> createRole(@Valid @RequestBody RoleRequest request) {
        RoleResponse role = roleService.createRole(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(role);
    }

    @GetMapping
    public List<RoleResponse> listRoles() {
        return roleService.getRoles();
    }
}
