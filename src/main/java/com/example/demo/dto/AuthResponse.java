package com.example.demo.dto;

public class AuthResponse {
    private String message;
    private Long userId;
    private String username;

    public AuthResponse(String message, Long userId, String username) {
        this.message = message;
        this.userId = userId;
        this.username = username;
    }

    public String getMessage() {
        return message;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }
}
