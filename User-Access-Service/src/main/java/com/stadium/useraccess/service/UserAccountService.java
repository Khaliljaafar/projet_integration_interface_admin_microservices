package com.stadium.useraccess.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stadium.useraccess.domain.Role;
import com.stadium.useraccess.domain.UserAccount;
import com.stadium.useraccess.dto.UserRegistrationRequest;
import com.stadium.useraccess.dto.UserResponse;
import com.stadium.useraccess.dto.UserUpdateRequest;
import com.stadium.useraccess.exception.DuplicateResourceException;
import com.stadium.useraccess.exception.ResourceNotFoundException;
import com.stadium.useraccess.repository.UserAccountRepository;

@Service
@Transactional
public class UserAccountService {

    private final UserAccountRepository userAccountRepository;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;

    public UserAccountService(UserAccountRepository userAccountRepository, RoleService roleService,
            PasswordEncoder passwordEncoder) {
        this.userAccountRepository = userAccountRepository;
        this.roleService = roleService;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse registerUser(UserRegistrationRequest request) {
        if (userAccountRepository.existsByUsernameIgnoreCase(request.getUsername())) {
            throw new DuplicateResourceException("Username already in use: " + request.getUsername());
        }
        Role role = roleService.getRoleOrThrow(request.getRoleId());
        UserAccount account = new UserAccount();
        account.setRole(role);
        account.setUsername(request.getUsername());
        account.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        account.setFirstName(request.getFirstName());
        account.setSecondName(request.getSecondName());
        account.setAge(request.getAge());
        account.setAddress(request.getAddress());
        account.setPhoneNumber(request.getPhoneNumber());
        return UserResponse.fromEntity(userAccountRepository.save(account));
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userAccountRepository.findAll()
                .stream()
                .map(UserResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long userId) {
        return UserResponse.fromEntity(findUserOrThrow(userId));
    }

    public UserResponse updateUser(Long userId, UserUpdateRequest request) {
        UserAccount account = findUserOrThrow(userId);
        if (request.getRoleId() != null) {
            Role role = roleService.getRoleOrThrow(request.getRoleId());
            account.setRole(role);
        }
        if (request.getFirstName() != null) {
            account.setFirstName(request.getFirstName());
        }
        if (request.getSecondName() != null) {
            account.setSecondName(request.getSecondName());
        }
        if (request.getAge() != null) {
            if (request.getAge() < 0) {
                throw new IllegalArgumentException("Age must be positive");
            }
            account.setAge(request.getAge());
        }
        if (request.getAddress() != null) {
            account.setAddress(request.getAddress());
        }
        if (request.getPhoneNumber() != null) {
            account.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getBanned() != null) {
            account.setBanned(request.getBanned());
        }
        return UserResponse.fromEntity(account);
    }

    public void deleteUser(Long userId) {
        UserAccount account = findUserOrThrow(userId);
        userAccountRepository.delete(account);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getUsersByRole(Long roleId) {
        roleService.getRoleOrThrow(roleId);
        return userAccountRepository.findByRoleId(roleId)
                .stream()
                .map(UserResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserAccount findUserOrThrow(Long userId) {
        return userAccountRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
    }

    @Transactional(readOnly = true)
    public UserAccount findByUsername(String username) {
        return userAccountRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new ResourceNotFoundException("Unknown username: " + username));
    }
}
