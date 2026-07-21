package com.fitconnect.trainer.controller;

import com.fitconnect.trainer.dto.TrainerCreateRequest;
import com.fitconnect.trainer.dto.TrainerResponse;
import com.fitconnect.trainer.service.TrainerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trainers")
@RequiredArgsConstructor
public class TrainerController {

    private final TrainerService trainerService;

    @PostMapping
    public ResponseEntity<TrainerResponse> addTrainer(
            @RequestHeader("X-Gym-Id") Long gymId,
            @Valid @RequestBody TrainerCreateRequest request) {
        return ResponseEntity.ok(trainerService.addTrainer(gymId, request));
    }

    @GetMapping
    public ResponseEntity<List<TrainerResponse>> getTrainers(@RequestHeader("X-Gym-Id") Long gymId) {
        return ResponseEntity.ok(trainerService.getTrainers(gymId));
    }

    @GetMapping("/{trainerId}")
    public ResponseEntity<TrainerResponse> getTrainer(
            @RequestHeader("X-Gym-Id") Long gymId,
            @PathVariable Long trainerId) {
        return ResponseEntity.ok(trainerService.getTrainer(gymId, trainerId));
    }

    @PatchMapping("/{trainerId}/deactivate")
    public ResponseEntity<Void> removeTrainer(
            @RequestHeader("X-Gym-Id") Long gymId,
            @PathVariable Long trainerId) {
        trainerService.removeTrainer(gymId, trainerId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{trainerId}")
    public ResponseEntity<Void> deleteTrainer(
            @RequestHeader("X-Gym-Id") Long gymId,
            @PathVariable Long trainerId) {
        trainerService.deleteTrainerPermanently(gymId, trainerId);
        return ResponseEntity.noContent().build();
    }
}