package com.fitconnect.member.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class FeePaymentResponse {
    private Long id;
    private Long memberId;
    private BigDecimal amount;
    private LocalDate dueDate;
    private LocalDate paidDate;
    private String status;
}