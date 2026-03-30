package com.example.demo.dto;

public class AuthResponse {
    private String message;
    private Long userId;
    private String username;
    private String token;

    public AuthResponse(String message, Long userId, String username, String token) {
        this.message = message;
        this.userId = userId;
        this.username = username;
        this.token = token;
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

    public String getToken() {
        return token;
    }
}
