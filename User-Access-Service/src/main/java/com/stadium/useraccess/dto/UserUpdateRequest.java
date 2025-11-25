package com.stadium.useraccess.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public class UserUpdateRequest {

    @Size(max = 80)
    private String firstName;

    @Size(max = 80)
    private String secondName;

    @Min(0)
    private Integer age;

    @Size(max = 255)
    private String address;

    @Size(max = 30)
    private String phoneNumber;

    private Boolean banned;

    private Long roleId;

    public UserUpdateRequest() {
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

    public Boolean getBanned() {
        return banned;
    }

    public void setBanned(Boolean banned) {
        this.banned = banned;
    }

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }
}
