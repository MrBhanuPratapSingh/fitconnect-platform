package com.fitconnect.gym.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "gym")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Gym {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Reference only — the actual user record lives in auth-service's DB.
    // No JPA relationship across services; this is just an opaque foreign id from the JWT.
    @Column(nullable = false)
    private Long ownerId;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String address;

    private Double latitude;
    private Double longitude;

    private LocalTime openingTime;
    private LocalTime closingTime;

    private String contactPhone;
    private String contactEmail;

    private Integer establishedYear;

    @Builder.Default
    @OneToMany(mappedBy = "gym", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GymMedia> media = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "gym", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FeePlan> feePlans = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "gym", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Achievement> achievements = new ArrayList<>();
}