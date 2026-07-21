package com.fitconnect.member.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class MarkPaidRequest {

    @NotNull
    private LocalDate paidDate;
}