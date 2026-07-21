package com.fitconnect.trainer.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class SalaryPaymentResponse {
    private Long id;
    private Long trainerId;
    private BigDecimal amount;
    private YearMonth salaryMonth;
    private LocalDate paidDate;
    private String status;
}