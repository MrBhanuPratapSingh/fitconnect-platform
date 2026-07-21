package com.fitconnect.review.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "review", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"gym_id", "user_id"}) // one review per user per gym
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Reference to gym-service's Gym.id
    @Column(name = "gym_id", nullable = false)
    private Long gymId;

    // Reference to auth-service's AppUser.id
    @Column(name = "user_id", nullable = false)
    private Long userId;

    private String userName; // denormalized, so we don't call auth-service on every read

    @Column(nullable = false)
    private Integer rating; // 1 to 5

    @Column(length = 1000)
    private String comment;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}