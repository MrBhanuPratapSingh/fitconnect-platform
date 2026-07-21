package com.fitconnect.review.service;

import com.fitconnect.review.dto.*;
import com.fitconnect.review.entity.Review;
import com.fitconnect.review.exception.ReviewNotFoundException;
import com.fitconnect.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public ReviewResponse createReview(Long gymId, ReviewCreateRequest request) {
        if (reviewRepository.findByGymIdAndUserId(gymId, request.getUserId()).isPresent()) {
            throw new IllegalStateException("You have already reviewed this gym. Please edit your existing review instead.");
        }

        Review review = Review.builder()
                .gymId(gymId)
                .userId(request.getUserId())
                .userName(request.getUserName())
                .rating(request.getRating())
                .comment(request.getComment())
                .createdAt(LocalDateTime.now())
                .build();

        return toResponse(reviewRepository.save(review));
    }

    public ReviewResponse updateReview(Long gymId, Long userId, ReviewUpdateRequest request) {
        Review review = reviewRepository.findByGymIdAndUserId(gymId, userId)
                .orElseThrow(() -> new ReviewNotFoundException("You haven't reviewed this gym yet"));

        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setUpdatedAt(LocalDateTime.now());

        return toResponse(reviewRepository.save(review));
    }

    public void deleteReview(Long gymId, Long userId) {
        Review review = reviewRepository.findByGymIdAndUserId(gymId, userId)
                .orElseThrow(() -> new ReviewNotFoundException("You haven't reviewed this gym yet"));

        reviewRepository.delete(review);
    }

    public List<ReviewResponse> getReviewsForGym(Long gymId) {
        return reviewRepository.findByGymIdOrderByCreatedAtDesc(gymId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public GymRatingSummary getRatingSummary(Long gymId) {
        Double avg = reviewRepository.findAverageRatingByGymId(gymId);
        long count = reviewRepository.countByGymId(gymId);

        return GymRatingSummary.builder()
                .gymId(gymId)
                .averageRating(avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0)
                .totalReviews(count)
                .build();
    }

    private ReviewResponse toResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .gymId(review.getGymId())
                .userId(review.getUserId())
                .userName(review.getUserName())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}