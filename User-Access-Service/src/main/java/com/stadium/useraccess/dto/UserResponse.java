package com.stadium.useraccess.dto;

import java.time.LocalDateTime;

import com.stadium.useraccess.domain.UserAccount;

public class UserResponse {

    private Long id;
    private String username;
    private String firstName;
    private String secondName;
    private Integer age;
    private String address;
    private String phoneNumber;
    private boolean banned;
    private Long roleId;
    private String roleLabel;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public UserResponse() {
    }

    public static UserResponse fromEntity(UserAccount account) {
        UserResponse response = new UserResponse();
        response.setId(account.getId());
        response.setUsername(account.getUsername());
        response.setFirstName(account.getFirstName());
        response.setSecondName(account.getSecondName());
        response.setAge(account.getAge());
        response.setAddress(account.getAddress());
        response.setPhoneNumber(account.getPhoneNumber());
        response.setBanned(account.isBanned());
        if (account.getRole() != null) {
            response.setRoleId(account.getRole().getId());
            response.setRoleLabel(account.getRole().getLabel());
        }
        response.setCreatedAt(account.getCreatedAt());
        response.setUpdatedAt(account.getUpdatedAt());
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getSecondName() {
        return secondName;
    }

    public void setSecondName(String secondName) {
        this.secondName = secondName;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public boolean isBanned() {
        return banned;
    }

    public void setBanned(boolean banned) {
        this.banned = banned;
    }

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    public String getRoleLabel() {
        return roleLabel;
    }

    public void setRoleLabel(String roleLabel) {
        this.roleLabel = roleLabel;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
