package com.fitconnect.trainer.controller;

import com.fitconnect.trainer.dto.*;
import com.fitconnect.trainer.service.SalaryPaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trainers")
@RequiredArgsConstructor
public class SalaryPaymentController {

    private final SalaryPaymentService salaryPaymentService;

    @PostMapping("/{trainerId}/salary")
    public ResponseEntity<SalaryPaymentResponse> createSalary(
            @RequestHeader("X-Gym-Id") Long gymId,
            @PathVariable Long trainerId,
            @Valid @RequestBody SalaryPaymentRequest request) {
        return ResponseEntity.ok(salaryPaymentService.createSalary(gymId, trainerId, request));
    }

    @GetMapping("/{trainerId}/salary")
    public ResponseEntity<List<SalaryPaymentResponse>> getSalaryHistory(
            @RequestHeader("X-Gym-Id") Long gymId,
            @PathVariable Long trainerId) {
        return ResponseEntity.ok(salaryPaymentService.getSalaryHistory(gymId, trainerId));
    }

    @PatchMapping("/salary/{paymentId}/mark-paid")
    public ResponseEntity<SalaryPaymentResponse> markAsPaid(
            @RequestHeader("X-Gym-Id") Long gymId,
            @PathVariable Long paymentId,
            @Valid @RequestBody MarkSalaryPaidRequest request) {
        return ResponseEntity.ok(salaryPaymentService.markAsPaid(gymId, paymentId, request));
    }
}