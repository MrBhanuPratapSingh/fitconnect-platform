package com.fitconnect.gym.service;

import com.fitconnect.gym.dto.AchievementRequest;
import com.fitconnect.gym.entity.Achievement;
import com.fitconnect.gym.entity.Gym;
import com.fitconnect.gym.exception.GymNotFoundException;
import com.fitconnect.gym.repository.AchievementRepository;
import com.fitconnect.gym.repository.GymRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AchievementService {

    private final AchievementRepository achievementRepository;
    private final GymRepository gymRepository;

    public void addAchievement(Long ownerId, AchievementRequest request) {
        Gym gym = gymRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new GymNotFoundException("No gym found for this owner"));

        Achievement achievement = Achievement.builder()
                .gym(gym)
                .title(request.getTitle())
                .description(request.getDescription())
                .achievedOn(request.getAchievedOn())
                .build();

        achievementRepository.save(achievement);
    }

    public void deleteAchievement(Long ownerId, Long achievementId) {
        Gym gym = gymRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new GymNotFoundException("No gym found for this owner"));

        Achievement achievement = achievementRepository.findById(achievementId)
                .orElseThrow(() -> new GymNotFoundException("Achievement not found with id: " + achievementId));

        if (!achievement.getGym().getId().equals(gym.getId())) {
            throw new IllegalStateException("This achievement does not belong to your gym");
        }

        achievementRepository.delete(achievement);
    }
}