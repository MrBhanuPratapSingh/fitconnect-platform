package com.fitconnect.trainer.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class TrainerCreateRequest {

    @NotBlank
    private String fullName;

    private String phone;

    @Email
    private String email;

    private String specialization;

    private Integer experienceYears;

    private String shiftTiming;

    @NotNull
    private LocalDate joinDate;

    private Long userId; // optional
}