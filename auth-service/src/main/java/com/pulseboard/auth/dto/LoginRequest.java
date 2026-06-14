package com.pulseboard.auth.dto;

import com.pulseboard.auth.model.Role;
import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
