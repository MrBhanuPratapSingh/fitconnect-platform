package com.fitconnect.gym.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "gym_media")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GymMedia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gym_id", nullable = false)
    private Gym gym;

    @Column(nullable = false)
    private String url; // Cloudinary/S3 URL

    @Enumerated(EnumType.STRING)
    private MediaType type; // PHOTO or VIDEO

    private boolean isCover;

    private Integer displayOrder;
}