package com.fitconnect.gym.controller;

import com.fitconnect.gym.dto.AchievementRequest;
import com.fitconnect.gym.service.AchievementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gyms/me/achievements")
@RequiredArgsConstructor
public class AchievementController {

    private final AchievementService achievementService;

    @PostMapping
    public ResponseEntity<Void> addAchievement(
            @RequestHeader("X-User-Id") Long ownerId,
            @Valid @RequestBody AchievementRequest request) {
        achievementService.addAchievement(ownerId, request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{achievementId}")
    public ResponseEntity<Void> deleteAchievement(
            @RequestHeader("X-User-Id") Long ownerId,
            @PathVariable Long achievementId) {
        achievementService.deleteAchievement(ownerId, achievementId);
        return ResponseEntity.noContent().build();
    }
}