package com.stadium.useraccess.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stadium.useraccess.dto.UserRegistrationRequest;
import com.stadium.useraccess.dto.UserResponse;
import com.stadium.useraccess.dto.UserUpdateRequest;
import com.stadium.useraccess.service.UserAccountService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
@Validated
public class UserAccountController {

    private final UserAccountService userAccountService;

    public UserAccountController(UserAccountService userAccountService) {
        this.userAccountService = userAccountService;
    }

    @PostMapping
    public ResponseEntity<UserResponse> registerUser(@Valid @RequestBody UserRegistrationRequest request) {
        UserResponse response = userAccountService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public List<UserResponse> getUsers() {
        return userAccountService.getAllUsers();
    }

    @GetMapping("/{id}")
    public UserResponse getUser(@PathVariable("id") Long userId) {
        return userAccountService.getUserById(userId);
    }

    @PutMapping("/{id}")
    public UserResponse updateUser(@PathVariable("id") Long userId,
            @Valid @RequestBody UserUpdateRequest request) {
        return userAccountService.updateUser(userId, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") Long userId) {
        userAccountService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/role/{roleId}")
    public List<UserResponse> getUsersByRole(@PathVariable("roleId") Long roleId) {
        return userAccountService.getUsersByRole(roleId);
    }
}
