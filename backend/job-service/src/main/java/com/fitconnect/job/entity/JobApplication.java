package com.fitconnect.job.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "job_application")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_post_id", nullable = false)
    private JobPost jobPost;

    // Reference to auth-service's AppUser.id (the applying trainer)
    @Column(nullable = false)
    private Long applicantUserId;

    private String applicantName;
    private String applicantEmail;
    private String applicantPhone;

    @Column(length = 1000)
    private String coverNote;

    @Column(nullable = false)
    private LocalDate appliedDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status; // APPLIED, SHORTLISTED, REJECTED, HIRED
}