package com.stadium.useraccess.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stadium.useraccess.domain.UserAccount;
import com.stadium.useraccess.dto.LoginRequest;
import com.stadium.useraccess.dto.LoginResponse;
import com.stadium.useraccess.security.JwtService;

@Service
public class AuthService {

    private final UserAccountService userAccountService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserAccountService userAccountService, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userAccountService = userAccountService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional(readOnly = true)
    public LoginResponse authenticate(LoginRequest request) {
        UserAccount account = userAccountService.findByUsername(request.getUsername());
        boolean matches = passwordEncoder.matches(request.getPassword(), account.getPasswordHash());
        if (!matches) {
            return new LoginResponse(false, "Invalid credentials", null, null, null);
        }
        if (account.isBanned()) {
            return new LoginResponse(false, "User is banned", account.getId(), account.getRole().getId(),
                    account.getRole().getLabel());
        }
        String token = jwtService.generateToken(account);
        return new LoginResponse(true, "Authenticated", account.getId(), account.getRole().getId(),
                account.getRole().getLabel(), token);
    }
}
