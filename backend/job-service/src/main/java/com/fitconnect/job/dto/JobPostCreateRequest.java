package com.fitconnect.job.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class JobPostCreateRequest {

    @NotBlank
    private String gymName;

    private String gymAddress;
    private Double gymLatitude;
    private Double gymLongitude;

    @NotBlank
    private String title;

    private String description;

    @NotNull @Positive
    private BigDecimal salary;

    @NotBlank
    private String employmentType; // "FULL_TIME" or "PART_TIME"
}