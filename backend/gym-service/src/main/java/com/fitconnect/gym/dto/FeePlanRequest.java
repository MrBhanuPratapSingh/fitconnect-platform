package com.fitconnect.gym.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class FeePlanRequest {

    @NotBlank
    private String planName;

    @NotNull @Positive
    private BigDecimal amount;

    @NotBlank
    private String billingCycle; // "MONTHLY", "QUARTERLY", "YEARLY"
}