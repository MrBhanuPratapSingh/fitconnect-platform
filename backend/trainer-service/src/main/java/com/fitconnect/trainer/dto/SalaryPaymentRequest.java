package com.fitconnect.trainer.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.YearMonth;

@Data
public class SalaryPaymentRequest {

    @NotNull @Positive
    private BigDecimal amount;

    @NotNull
    private YearMonth salaryMonth; // format: "2026-07"
}