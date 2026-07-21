package com.fitconnect.gym.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;

@Data
public class AchievementRequest {

    @NotBlank
    private String title;

    private String description;

    private LocalDate achievedOn;
}