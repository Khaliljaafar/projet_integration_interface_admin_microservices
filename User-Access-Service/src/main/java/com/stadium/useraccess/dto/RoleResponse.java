package com.stadium.useraccess.dto;

import com.stadium.useraccess.domain.Role;

public class RoleResponse {

    private Long id;
    private String label;
    private String description;

    public RoleResponse() {
    }

    public static RoleResponse fromEntity(Role role) {
        RoleResponse response = new RoleResponse();
        response.setId(role.getId());
        response.setLabel(role.getLabel());
        response.setDescription(role.getDescription());
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
