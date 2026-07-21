package com.fitconnect.trainer.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "trainer_profile")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TrainerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_id", nullable = false, unique = true)
    private Trainer trainer;

    @Column(length = 1000)
    private String bio;

    private String certifications; // comma-separated for simplicity

    private String profilePhotoUrl;
}