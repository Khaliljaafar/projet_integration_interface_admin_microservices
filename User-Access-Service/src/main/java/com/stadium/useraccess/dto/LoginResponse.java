package com.stadium.useraccess.dto;

public class LoginResponse {

    private boolean authenticated;
    private String message;
    private Long userId;
    private Long roleId;
    private String roleLabel;
    private String accessToken;

    public LoginResponse() {
    }

    public LoginResponse(boolean authenticated, String message, Long userId, Long roleId, String roleLabel) {
        this.authenticated = authenticated;
        this.message = message;
        this.userId = userId;
        this.roleId = roleId;
        this.roleLabel = roleLabel;
    }

    public LoginResponse(boolean authenticated, String message, Long userId, Long roleId, String roleLabel, String accessToken) {
        this(authenticated, message, userId, roleId, roleLabel);
        this.accessToken = accessToken;
    }

    public boolean isAuthenticated() {
        return authenticated;
    }

    public void setAuthenticated(boolean authenticated) {
        this.authenticated = authenticated;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }
}
