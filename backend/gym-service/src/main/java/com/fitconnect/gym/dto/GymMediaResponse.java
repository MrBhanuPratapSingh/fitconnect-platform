package com.fitconnect.gym.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class GymMediaResponse {
    private Long id;
    private String url;
    private String type;
    private boolean isCover;
    private Integer displayOrder;
}