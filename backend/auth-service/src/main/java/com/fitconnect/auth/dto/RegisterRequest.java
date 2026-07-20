package com.fitconnect.auth.dto;

import com.fitconnect.auth.entity.RoleName;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank
    private String fullName;

    @NotBlank @Email
    private String email;

    @NotBlank @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotNull
    private RoleName role; // GYM_OWNER, USER, or TRAINER
}