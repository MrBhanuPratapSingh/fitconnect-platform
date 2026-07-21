package com.fitconnect.review.controller;

import com.fitconnect.review.dto.*;
import com.fitconnect.review.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gyms/{gymId}/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(
            @PathVariable Long gymId,
            @Valid @RequestBody ReviewCreateRequest request) {
        return ResponseEntity.ok(reviewService.createReview(gymId, request));
    }

    @PutMapping
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable Long gymId,
            @RequestParam Long userId,
            @Valid @RequestBody ReviewUpdateRequest request) {
        return ResponseEntity.ok(reviewService.updateReview(gymId, userId, request));
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long gymId,
            @RequestParam Long userId) {
        reviewService.deleteReview(gymId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<ReviewResponse>> getReviews(@PathVariable Long gymId) {
        return ResponseEntity.ok(reviewService.getReviewsForGym(gymId));
    }

    @GetMapping("/summary")
    public ResponseEntity<GymRatingSummary> getRatingSummary(@PathVariable Long gymId) {
        return ResponseEntity.ok(reviewService.getRatingSummary(gymId));
    }
}