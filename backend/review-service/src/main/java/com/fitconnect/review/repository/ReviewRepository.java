package com.fitconnect.review.repository;

import com.fitconnect.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByGymIdOrderByCreatedAtDesc(Long gymId);
    Optional<Review> findByGymIdAndUserId(Long gymId, Long userId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.gymId = :gymId")
    Double findAverageRatingByGymId(Long gymId);

    long countByGymId(Long gymId);
}