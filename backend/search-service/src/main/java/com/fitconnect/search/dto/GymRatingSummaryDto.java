package com.fitconnect.search.dto;

import lombok.Data;

@Data
public class GymRatingSummaryDto {
    private Long gymId;
    private Double averageRating;
    private long totalReviews;
}