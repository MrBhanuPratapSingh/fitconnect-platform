package com.fitconnect.gym.dto;

import lombok.*;
import java.time.LocalDate;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AchievementResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDate achievedOn;
}