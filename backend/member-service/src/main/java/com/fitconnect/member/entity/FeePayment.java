package com.fitconnect.member.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "fee_payment")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FeePayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private GymMember member;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private LocalDate dueDate;

    private LocalDate paidDate; // null if not yet paid

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;
}