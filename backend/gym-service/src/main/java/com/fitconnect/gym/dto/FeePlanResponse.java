package com.fitconnect.gym.dto;

import lombok.*;
import java.math.BigDecimal;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class FeePlanResponse {
    private Long id;
    private String planName;
    private BigDecimal amount;
    private String billingCycle;
}
