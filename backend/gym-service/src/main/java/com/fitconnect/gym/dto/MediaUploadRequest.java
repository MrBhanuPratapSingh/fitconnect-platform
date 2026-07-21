package com.fitconnect.gym.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MediaUploadRequest {

    @NotBlank
    private String url; // URL already uploaded to Cloudinary/S3 by the frontend

    @NotBlank
    private String type; // "PHOTO" or "VIDEO"

    private boolean isCover;

    private Integer displayOrder;
}