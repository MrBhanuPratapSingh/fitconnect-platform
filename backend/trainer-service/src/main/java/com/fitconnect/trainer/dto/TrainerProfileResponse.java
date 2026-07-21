package com.fitconnect.trainer.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TrainerProfileResponse {
    private Long trainerId;
    private String fullName;
    private String specialization;
    private Integer experienceYears;
    private String bio;
    private String certifications;
    private String profilePhotoUrl;
}