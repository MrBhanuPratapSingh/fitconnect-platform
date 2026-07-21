package com.fitconnect.member.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "gym_member")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GymMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Reference to gym-service's Gym.id — no cross-service join, just an opaque id
    @Column(nullable = false)
    private Long gymId;

    // If the member also has a FitConnect account (signed up as USER), this links to it.
    // Nullable — owner can add a member manually without them having an account yet.
    private Long userId;

    @Column(nullable = false)
    private String fullName;

    private String phone;
    private String email;

    @Column(nullable = false)
    private LocalDate joinDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MemberStatus status;

    // Reference to gym-service's FeePlan.id
    private Long feePlanId;

    @Builder.Default
    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FeePayment> payments = new ArrayList<>();
}