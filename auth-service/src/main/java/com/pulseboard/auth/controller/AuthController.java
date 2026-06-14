package com.pulseboard.auth.controller;

import com.pulseboard.auth.dto.AuthResponse;
import com.pulseboard.auth.dto.LoginRequest;
import com.pulseboard.auth.dto.RegisterRequest;
import com.pulseboard.auth.filter.JwtAuthUtil;
import com.pulseboard.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtAuthUtil jwtAuthUtil;
    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request){
        authService.registerTheUser(request);
        return "user register successfully";

    }
    @PostMapping("/login")
// AuthController — login method
    public AuthResponse loginUser(@RequestBody LoginRequest loginRequest) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        String role = authService.loginUser(loginRequest);
        String token = jwtAuthUtil.generateToken(loginRequest.getEmail(), role);
        return new AuthResponse(token, role, loginRequest.getEmail());
    }
}
