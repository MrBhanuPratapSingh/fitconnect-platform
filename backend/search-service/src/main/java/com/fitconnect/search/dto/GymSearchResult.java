package com.fitconnect.search.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class GymSearchResult {
    private Long id;
    private String name;
    private String address;
    private Double distanceKm; // null if user didn't provide lat/lng
    private Double lowestFee;  // cheapest fee plan, for quick display/sort
    private Double averageRating;
    private long totalReviews;
}