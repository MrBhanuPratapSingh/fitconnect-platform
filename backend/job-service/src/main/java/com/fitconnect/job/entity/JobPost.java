package com.fitconnect.job.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "job_post")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class JobPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Reference to gym-service's Gym.id
    @Column(nullable = false)
    private Long gymId;

    // Denormalized fields copied from gym-service at post time, so job search
    // doesn't need to call gym-service on every query. Refreshed if owner edits.
    @Column(nullable = false)
    private String gymName;

    private String gymAddress;
    private Double gymLatitude;
    private Double gymLongitude;

    @Column(nullable = false)
    private String title; // e.g. "Strength Trainer"

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private BigDecimal salary;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EmploymentType employmentType; // FULL_TIME, PART_TIME

    @Column(nullable = false)
    private LocalDate postedDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobStatus status; // OPEN, CLOSED

    @Builder.Default
    @OneToMany(mappedBy = "jobPost", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<JobApplication> applications = new ArrayList<>();
}