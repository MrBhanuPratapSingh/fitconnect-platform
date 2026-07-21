package com.fitconnect.trainer.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class MarkSalaryPaidRequest {

    @NotNull
    private LocalDate paidDate;
}