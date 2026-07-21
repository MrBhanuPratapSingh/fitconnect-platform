package com.fitconnect.trainer.service;

import com.fitconnect.trainer.dto.*;
import com.fitconnect.trainer.entity.Trainer;
import com.fitconnect.trainer.entity.TrainerStatus;
import com.fitconnect.trainer.exception.TrainerNotFoundException;
import com.fitconnect.trainer.repository.TrainerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrainerService {

    private final TrainerRepository trainerRepository;

    public TrainerResponse addTrainer(Long gymId, TrainerCreateRequest request) {
        Trainer trainer = Trainer.builder()
                .gymId(gymId)
                .userId(request.getUserId())
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .specialization(request.getSpecialization())
                .experienceYears(request.getExperienceYears())
                .shiftTiming(request.getShiftTiming())
                .joinDate(request.getJoinDate())
                .status(TrainerStatus.ACTIVE)
                .build();

        return toResponse(trainerRepository.save(trainer));
    }

    public List<TrainerResponse> getTrainers(Long gymId) {
        return trainerRepository.findByGymId(gymId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public TrainerResponse getTrainer(Long gymId, Long trainerId) {
        return toResponse(verifyOwnership(gymId, trainerId));
    }

    public void removeTrainer(Long gymId, Long trainerId) {
        Trainer trainer = verifyOwnership(gymId, trainerId);
        trainer.setStatus(TrainerStatus.INACTIVE);
        trainerRepository.save(trainer);
    }

    public void deleteTrainerPermanently(Long gymId, Long trainerId) {
        Trainer trainer = verifyOwnership(gymId, trainerId);
        trainerRepository.delete(trainer);
    }

    Trainer verifyOwnership(Long gymId, Long trainerId) {
        Trainer trainer = trainerRepository.findById(trainerId)
                .orElseThrow(() -> new TrainerNotFoundException("Trainer not found with id: " + trainerId));

        if (!trainer.getGymId().equals(gymId)) {
            throw new IllegalStateException("This trainer does not belong to your gym");
        }
        return trainer;
    }

    private TrainerResponse toResponse(Trainer trainer) {
        return TrainerResponse.builder()
                .id(trainer.getId())
                .gymId(trainer.getGymId())
                .userId(trainer.getUserId())
                .fullName(trainer.getFullName())
                .phone(trainer.getPhone())
                .email(trainer.getEmail())
                .specialization(trainer.getSpecialization())
                .experienceYears(trainer.getExperienceYears())
                .shiftTiming(trainer.getShiftTiming())
                .joinDate(trainer.getJoinDate())
                .status(trainer.getStatus().name())
                .build();
    }
}