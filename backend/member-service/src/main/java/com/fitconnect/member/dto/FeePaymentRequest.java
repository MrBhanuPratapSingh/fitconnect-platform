package com.fitconnect.member.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class FeePaymentRequest {

    @NotNull @Positive
    private BigDecimal amount;

    @NotNull
    private LocalDate dueDate;
}