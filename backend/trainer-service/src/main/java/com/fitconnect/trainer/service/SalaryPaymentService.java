package com.fitconnect.trainer.service;

import com.fitconnect.trainer.dto.*;
import com.fitconnect.trainer.entity.SalaryPayment;
import com.fitconnect.trainer.entity.SalaryStatus;
import com.fitconnect.trainer.entity.Trainer;
import com.fitconnect.trainer.exception.TrainerNotFoundException;
import com.fitconnect.trainer.repository.SalaryPaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalaryPaymentService {

    private final SalaryPaymentRepository salaryPaymentRepository;
    private final TrainerService trainerService;

    public SalaryPaymentResponse createSalary(Long gymId, Long trainerId, SalaryPaymentRequest request) {
        Trainer trainer = trainerService.verifyOwnership(gymId, trainerId);

        SalaryPayment payment = SalaryPayment.builder()
                .trainer(trainer)
                .amount(request.getAmount())
                .salaryMonth(request.getSalaryMonth())
                .status(SalaryStatus.PENDING)
                .build();

        return toResponse(salaryPaymentRepository.save(payment));
    }

    public List<SalaryPaymentResponse> getSalaryHistory(Long gymId, Long trainerId) {
        trainerService.verifyOwnership(gymId, trainerId);
        return salaryPaymentRepository.findByTrainerId(trainerId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public SalaryPaymentResponse markAsPaid(Long gymId, Long paymentId, MarkSalaryPaidRequest request) {
        SalaryPayment payment = salaryPaymentRepository.findById(paymentId)
                .orElseThrow(() -> new TrainerNotFoundException("Salary payment not found with id: " + paymentId));

        if (!payment.getTrainer().getGymId().equals(gymId)) {
            throw new IllegalStateException("This salary payment does not belong to your gym");
        }

        payment.setPaidDate(request.getPaidDate());
        payment.setStatus(SalaryStatus.PAID);

        return toResponse(salaryPaymentRepository.save(payment));
    }

    private SalaryPaymentResponse toResponse(SalaryPayment payment) {
        return SalaryPaymentResponse.builder()
                .id(payment.getId())
                .trainerId(payment.getTrainer().getId())
                .amount(payment.getAmount())
                .salaryMonth(payment.getSalaryMonth())
                .paidDate(payment.getPaidDate())
                .status(payment.getStatus().name())
                .build();
    }
}