package com.fitconnect.gym.controller;

import com.fitconnect.gym.dto.GymCreateRequest;
import com.fitconnect.gym.dto.GymResponse;
import com.fitconnect.gym.service.GymService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gyms")
@RequiredArgsConstructor
public class GymController {

    private final GymService gymService;

    @PostMapping
    public ResponseEntity<GymResponse> createGym(
            @RequestHeader("X-User-Id") Long ownerId,
            @Valid @RequestBody GymCreateRequest request) {
        return ResponseEntity.ok(gymService.createGym(ownerId, request));
    }

    @GetMapping("/me")
    public ResponseEntity<GymResponse> getMyGym(@RequestHeader("X-User-Id") Long ownerId) {
        return ResponseEntity.ok(gymService.getMyGym(ownerId));
    }

    @PutMapping("/me")
    public ResponseEntity<GymResponse> updateGym(
            @RequestHeader("X-User-Id") Long ownerId,
            @Valid @RequestBody GymCreateRequest request) {
        return ResponseEntity.ok(gymService.updateGym(ownerId, request));
    }
}