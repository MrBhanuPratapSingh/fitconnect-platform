package com.fitconnect.trainer.dto;

import lombok.*;
import java.time.LocalDate;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TrainerResponse {
    private Long id;
    private Long gymId;
    private Long userId;
    private String fullName;
    private String phone;
    private String email;
    private String specialization;
    private Integer experienceYears;
    private String shiftTiming;
    private LocalDate joinDate;
    private String status;
}