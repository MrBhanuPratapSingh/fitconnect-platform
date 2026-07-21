package com.fitconnect.trainer.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;

@Entity
@Table(name = "salary_payment")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SalaryPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_id", nullable = false)
    private Trainer trainer;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private YearMonth salaryMonth; // e.g. 2026-07

    private LocalDate paidDate; // null if unpaid

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SalaryStatus status;
}