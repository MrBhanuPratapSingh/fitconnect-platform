package com.fitconnect.member.controller;

import com.fitconnect.member.dto.*;
import com.fitconnect.member.service.FeePaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class FeePaymentController {

    private final FeePaymentService feePaymentService;

    @PostMapping("/{memberId}/payments")
    public ResponseEntity<FeePaymentResponse> createDuePayment(
            @RequestHeader("X-Gym-Id") Long gymId,
            @PathVariable Long memberId,
            @Valid @RequestBody FeePaymentRequest request) {
        return ResponseEntity.ok(feePaymentService.createDuePayment(gymId, memberId, request));
    }

    @GetMapping("/{memberId}/payments")
    public ResponseEntity<List<FeePaymentResponse>> getPayments(
            @RequestHeader("X-Gym-Id") Long gymId,
            @PathVariable Long memberId) {
        return ResponseEntity.ok(feePaymentService.getPaymentsForMember(gymId, memberId));
    }

    @GetMapping("/payments/overdue")
    public ResponseEntity<List<FeePaymentResponse>> getOverduePayments(
            @RequestHeader("X-Gym-Id") Long gymId) {
        return ResponseEntity.ok(feePaymentService.getOverduePayments(gymId));
    }

    @PatchMapping("/payments/{paymentId}/mark-paid")
    public ResponseEntity<FeePaymentResponse> markAsPaid(
            @RequestHeader("X-Gym-Id") Long gymId,
            @PathVariable Long paymentId,
            @Valid @RequestBody MarkPaidRequest request) {
        return ResponseEntity.ok(feePaymentService.markAsPaid(gymId, paymentId, request));
    }
}