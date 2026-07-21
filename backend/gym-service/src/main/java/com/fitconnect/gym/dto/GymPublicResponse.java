package com.fitconnect.gym.dto;

import lombok.*;
import java.time.LocalTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class GymPublicResponse {
    private Long id;
    private String name;
    private String description;
    private String address;
    private Double latitude;
    private Double longitude;
    private LocalTime openingTime;
    private LocalTime closingTime;
    private String contactPhone;
    private String contactEmail;
    private Integer establishedYear;
    private List<GymMediaResponse> media;
    private List<FeePlanResponse> feePlans;
    private List<AchievementResponse> achievements;
}