package com.fitconnect.search.service;

import com.fitconnect.search.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GymSearchService {

    private final RestTemplate restTemplate;

    @Value("${services.gym-service.url}")
    private String gymServiceUrl;

    @Value("${services.review-service.url}")
    private String reviewServiceUrl;

    public List<GymSearchResult> search(String keyword, Double userLat, Double userLng,
                                         Double maxFee, Double minRating, String sortBy) {

        // 1. Fetch gyms from gym-service (public search, optionally filtered by keyword)
        String gymUrl = gymServiceUrl + "/api/public/gyms" + (keyword != null ? "?keyword=" + keyword : "");
        GymPublicDto[] gyms = restTemplate.getForObject(gymUrl, GymPublicDto[].class);

        if (gyms == null) {
            return Collections.emptyList();
        }

        // 2. For each gym, fetch its rating summary and build the combined result
        List<GymSearchResult> results = new ArrayList<>();

        for (GymPublicDto gym : gyms) {
            GymRatingSummaryDto rating = fetchRating(gym.getId());

            Double distance = (userLat != null && userLng != null && gym.getLatitude() != null && gym.getLongitude() != null)
                    ? haversineDistanceKm(userLat, userLng, gym.getLatitude(), gym.getLongitude())
                    : null;

            Double lowestFee = gym.getFeePlans() == null || gym.getFeePlans().isEmpty()
                    ? null
                    : gym.getFeePlans().stream()
                        .map(FeePlanDto::getAmount)
                        .filter(Objects::nonNull)
                        .mapToDouble(java.math.BigDecimal::doubleValue)
                        .min()
                        .orElse(Double.NaN);

            results.add(GymSearchResult.builder()
                    .id(gym.getId())
                    .name(gym.getName())
                    .address(gym.getAddress())
                    .distanceKm(distance != null ? Math.round(distance * 10.0) / 10.0 : null)
                    .lowestFee(lowestFee != null && !lowestFee.isNaN() ? lowestFee : null)
                    .averageRating(rating != null ? rating.getAverageRating() : 0.0)
                    .totalReviews(rating != null ? rating.getTotalReviews() : 0)
                    .build());
        }

        // 3. Apply filters
        List<GymSearchResult> filtered = results.stream()
                .filter(r -> maxFee == null || r.getLowestFee() == null || r.getLowestFee() <= maxFee)
                .filter(r -> minRating == null || r.getAverageRating() >= minRating)
                .collect(Collectors.toList());

        // 4. Apply sorting
        Comparator<GymSearchResult> comparator = switch (sortBy != null ? sortBy : "distance") {
            case "fee" -> Comparator.comparing(GymSearchResult::getLowestFee, Comparator.nullsLast(Double::compareTo));
            case "rating" -> Comparator.comparing(GymSearchResult::getAverageRating, Comparator.nullsLast(Double::compareTo)).reversed();
            default -> Comparator.comparing(GymSearchResult::getDistanceKm, Comparator.nullsLast(Double::compareTo));
        };

        filtered.sort(comparator);
        return filtered;
    }

    private GymRatingSummaryDto fetchRating(Long gymId) {
        try {
            String url = reviewServiceUrl + "/api/gyms/" + gymId + "/reviews/summary";
            return restTemplate.getForObject(url, GymRatingSummaryDto.class);
        } catch (Exception e) {
            // review-service might have no reviews yet, or be briefly unavailable —
            // don't let that break the whole search, just show 0 rating for this gym
            return null;
        }
    }

    // Haversine formula — great-circle distance between two lat/lng points, in km
    private double haversineDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth's radius in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}