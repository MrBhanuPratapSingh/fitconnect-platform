package com.fitconnect.member.service;

import com.fitconnect.member.dto.*;
import com.fitconnect.member.entity.FeePayment;
import com.fitconnect.member.entity.GymMember;
import com.fitconnect.member.entity.PaymentStatus;
import com.fitconnect.member.exception.MemberNotFoundException;
import com.fitconnect.member.repository.FeePaymentRepository;
import com.fitconnect.member.repository.GymMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeePaymentService {

    private final FeePaymentRepository feePaymentRepository;
    private final GymMemberRepository gymMemberRepository;

    public FeePaymentResponse createDuePayment(Long gymId, Long memberId, FeePaymentRequest request) {
        GymMember member = verifyOwnership(gymId, memberId);

        FeePayment payment = FeePayment.builder()
                .member(member)
                .amount(request.getAmount())
                .dueDate(request.getDueDate())
                .status(PaymentStatus.PENDING)
                .build();

        return toResponse(feePaymentRepository.save(payment));
    }

    public List<FeePaymentResponse> getPaymentsForMember(Long gymId, Long memberId) {
        verifyOwnership(gymId, memberId);
        return feePaymentRepository.findByMemberId(memberId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<FeePaymentResponse> getOverduePayments(Long gymId) {
        markOverduePast(gymId);
        return feePaymentRepository.findByMemberGymIdAndStatus(gymId, PaymentStatus.OVERDUE).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public FeePaymentResponse markAsPaid(Long gymId, Long paymentId, MarkPaidRequest request) {
        FeePayment payment = feePaymentRepository.findById(paymentId)
                .orElseThrow(() -> new MemberNotFoundException("Payment not found with id: " + paymentId));

        if (!payment.getMember().getGymId().equals(gymId)) {
            throw new IllegalStateException("This payment does not belong to your gym");
        }

        payment.setPaidDate(request.getPaidDate());
        payment.setStatus(PaymentStatus.PAID);

        return toResponse(feePaymentRepository.save(payment));
    }

    // Simple pass to flip any PENDING payment past its due date into OVERDUE
    private void markOverduePast(Long gymId) {
        List<FeePayment> pending = feePaymentRepository.findByMemberGymIdAndStatus(gymId, PaymentStatus.PENDING);
        LocalDate today = LocalDate.now();

        for (FeePayment payment : pending) {
            if (payment.getDueDate().isBefore(today)) {
                payment.setStatus(PaymentStatus.OVERDUE);
                feePaymentRepository.save(payment);
            }
        }
    }

    private GymMember verifyOwnership(Long gymId, Long memberId) {
        GymMember member = gymMemberRepository.findById(memberId)
                .orElseThrow(() -> new MemberNotFoundException("Member not found with id: " + memberId));

        if (!member.getGymId().equals(gymId)) {
            throw new IllegalStateException("This member does not belong to your gym");
        }
        return member;
    }

    private FeePaymentResponse toResponse(FeePayment payment) {
        return FeePaymentResponse.builder()
                .id(payment.getId())
                .memberId(payment.getMember().getId())
                .amount(payment.getAmount())
                .dueDate(payment.getDueDate())
                .paidDate(payment.getPaidDate())
                .status(payment.getStatus().name())
                .build();
    }
}