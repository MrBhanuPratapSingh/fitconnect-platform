package com.fitconnect.review.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class GymRatingSummary {
    private Long gymId;
    private Double averageRating;
    private long totalReviews;
}