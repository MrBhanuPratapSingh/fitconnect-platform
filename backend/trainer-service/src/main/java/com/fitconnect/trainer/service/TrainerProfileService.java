package com.fitconnect.trainer.service;

import com.fitconnect.trainer.dto.TrainerProfileRequest;
import com.fitconnect.trainer.dto.TrainerProfileResponse;
import com.fitconnect.trainer.entity.Trainer;
import com.fitconnect.trainer.entity.TrainerProfile;
import com.fitconnect.trainer.exception.TrainerNotFoundException;
import com.fitconnect.trainer.repository.TrainerProfileRepository;
import com.fitconnect.trainer.repository.TrainerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TrainerProfileService {

    private final TrainerProfileRepository trainerProfileRepository;
    private final TrainerRepository trainerRepository;

    public TrainerProfileResponse upsertProfile(Long trainerId, TrainerProfileRequest request) {
        Trainer trainer = trainerRepository.findById(trainerId)
                .orElseThrow(() -> new TrainerNotFoundException("Trainer not found with id: " + trainerId));

        TrainerProfile profile = trainerProfileRepository.findByTrainerId(trainerId)
                .orElse(TrainerProfile.builder().trainer(trainer).build());

        profile.setBio(request.getBio());
        profile.setCertifications(request.getCertifications());
        profile.setProfilePhotoUrl(request.getProfilePhotoUrl());

        TrainerProfile saved = trainerProfileRepository.save(profile);
        return toResponse(trainer, saved);
    }

    public TrainerProfileResponse getProfile(Long trainerId) {
        Trainer trainer = trainerRepository.findById(trainerId)
                .orElseThrow(() -> new TrainerNotFoundException("Trainer not found with id: " + trainerId));

        TrainerProfile profile = trainerProfileRepository.findByTrainerId(trainerId)
                .orElseThrow(() -> new TrainerNotFoundException("Profile not set up yet for this trainer"));

        return toResponse(trainer, profile);
    }

    private TrainerProfileResponse toResponse(Trainer trainer, TrainerProfile profile) {
        return TrainerProfileResponse.builder()
                .trainerId(trainer.getId())
                .fullName(trainer.getFullName())
                .specialization(trainer.getSpecialization())
                .experienceYears(trainer.getExperienceYears())
                .bio(profile.getBio())
                .certifications(profile.getCertifications())
                .profilePhotoUrl(profile.getProfilePhotoUrl())
                .build();
    }
}