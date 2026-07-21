package com.fitconnect.trainer.dto;

import lombok.Data;

@Data
public class TrainerProfileRequest {
    private String bio;
    private String certifications;
    private String profilePhotoUrl;
}