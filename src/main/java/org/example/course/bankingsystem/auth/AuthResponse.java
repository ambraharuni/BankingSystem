package org.example.course.bankingsystem.auth;

public class AuthResponse {
    public String token;
    public String role;

    public AuthResponse(String token, String role) {
        this.token = token;
        this.role = role;
    }
}