package com.fitconnect.trainer.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "trainer")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Trainer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Reference to gym-service's Gym.id
    @Column(nullable = false)
    private Long gymId;

    // Reference to auth-service's AppUser.id — nullable, since owner can add
    // a trainer manually before that trainer ever creates a FitConnect account
    private Long userId;

    @Column(nullable = false)
    private String fullName;

    private String phone;
    private String email;

    private String specialization; // e.g. "Strength Training", "Yoga", "Cardio"

    private Integer experienceYears;

    private String shiftTiming; // e.g. "6 AM - 2 PM"

    @Column(nullable = false)
    private LocalDate joinDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TrainerStatus status;

    @Builder.Default
    @OneToMany(mappedBy = "trainer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SalaryPayment> salaryPayments = new ArrayList<>();

    @OneToOne(mappedBy = "trainer", cascade = CascadeType.ALL, orphanRemoval = true)
    private TrainerProfile profile;
}