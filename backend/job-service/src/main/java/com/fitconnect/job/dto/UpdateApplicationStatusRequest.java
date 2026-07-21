package com.fitconnect.job.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateApplicationStatusRequest {

    @NotBlank
    private String status; // "SHORTLISTED", "REJECTED", "HIRED"
}