package com.stadium.useraccess.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.stadium.useraccess.domain.UserAccount;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    @Value("${app.security.jwt.secret}")
    private String secret;

    @Value("${app.security.jwt.expiration-ms:3600000}")
    private long expirationMs;

    public String generateToken(UserAccount account) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("uid", account.getId());
        claims.put("role", account.getRole() != null ? account.getRole().getLabel() : "");
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(account.getUsername())
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(Keys.hmacShaKeyFor(getKey()), SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims validateAndGetClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private byte[] getKey() {
        // support both raw and base64 strings
        try {
            return Decoders.BASE64.decode(secret);
        } catch (Exception ex) {
            return secret.getBytes(StandardCharsets.UTF_8);
        }
    }
}
