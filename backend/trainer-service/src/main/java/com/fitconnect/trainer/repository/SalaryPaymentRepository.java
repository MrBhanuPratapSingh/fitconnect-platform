package com.fitconnect.trainer.repository;

import com.fitconnect.trainer.entity.SalaryPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SalaryPaymentRepository extends JpaRepository<SalaryPayment, Long> {
    List<SalaryPayment> findByTrainerId(Long trainerId);
}