package com.fitconnect.trainer.controller;

import com.fitconnect.trainer.dto.TrainerProfileRequest;
import com.fitconnect.trainer.dto.TrainerProfileResponse;
import com.fitconnect.trainer.service.TrainerProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trainers")
@RequiredArgsConstructor
public class TrainerProfileController {

    private final TrainerProfileService trainerProfileService;

    @PutMapping("/{trainerId}/profile")
    public ResponseEntity<TrainerProfileResponse> upsertProfile(
            @PathVariable Long trainerId,
            @RequestBody TrainerProfileRequest request) {
        return ResponseEntity.ok(trainerProfileService.upsertProfile(trainerId, request));
    }

    @GetMapping("/{trainerId}/profile")
    public ResponseEntity<TrainerProfileResponse> getProfile(@PathVariable Long trainerId) {
        return ResponseEntity.ok(trainerProfileService.getProfile(trainerId));
    }
}