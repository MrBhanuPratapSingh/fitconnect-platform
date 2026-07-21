package com.fitconnect.gym.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "fee_plan")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FeePlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gym_id", nullable = false)
    private Gym gym;

    @Column(nullable = false)
    private String planName; // e.g. "Monthly", "Quarterly", "Yearly"

    @Column(nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private BillingCycle billingCycle; // MONTHLY, QUARTERLY, YEARLY
}