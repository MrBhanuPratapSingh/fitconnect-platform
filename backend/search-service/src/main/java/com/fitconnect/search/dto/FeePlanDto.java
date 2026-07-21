package com.fitconnect.search.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class FeePlanDto {
    private Long id;
    private String planName;
    private BigDecimal amount;
    private String billingCycle;
}