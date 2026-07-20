package com.fitconnect.auth.service;

import com.fitconnect.auth.dto.*;
import com.fitconnect.auth.entity.*;
import com.fitconnect.auth.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalStateException("Email already registered");
        }

        Role role = roleRepository.findByName(request.getRole())
                .orElseThrow(() -> new IllegalStateException("Role not found: seed roles table first"));

        AppUser user = AppUser.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .provider("LOCAL")
                .roles(Set.of(role))
                .build();

        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail(), role.getName().name());

        return AuthResponse.builder()
                .token(token)
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(role.getName().name())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        AppUser user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (user.getPassword() == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String roleName = user.getRoles().iterator().next().getName().name();
        String token = jwtService.generateToken(user.getEmail(), roleName);

        return AuthResponse.builder()
                .token(token)
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(roleName)
                .build();
    }
}