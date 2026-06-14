package com.pulseboard.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

// AuthResponse.java
@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String role;
    private String email;
}