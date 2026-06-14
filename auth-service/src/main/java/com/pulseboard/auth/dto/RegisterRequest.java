package com.pulseboard.auth.dto;

import com.pulseboard.auth.model.Role;
import lombok.Data;
import org.springframework.stereotype.Service;

@Data
public class RegisterRequest {

    private Long id;
    private String username;
    private String email;
    private String password;
    private Role role;
}
