package com.fitconnect.job.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class JobApplicationRequest {

    @NotNull
    private Long applicantUserId;

    @NotBlank
    private String applicantName;

    @Email
    private String applicantEmail;

    private String applicantPhone;

    private String coverNote;
}