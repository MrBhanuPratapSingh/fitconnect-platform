package com.fitconnect.member.repository;

import com.fitconnect.member.entity.FeePayment;
import com.fitconnect.member.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FeePaymentRepository extends JpaRepository<FeePayment, Long> {
    List<FeePayment> findByMemberId(Long memberId);
    List<FeePayment> findByMemberGymIdAndStatus(Long gymId, PaymentStatus status);
}