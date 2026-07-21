package com.fitconnect.member.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class MemberCreateRequest {

    @NotBlank
    private String fullName;

    private String phone;

    @Email
    private String email;

    @NotNull
    private LocalDate joinDate;

    private Long feePlanId;

    private Long userId; // optional, if member has a FitConnect account
}