package com.fitconnect.gym.controller;

import com.fitconnect.gym.dto.FeePlanRequest;
import com.fitconnect.gym.service.FeePlanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gyms/me/fee-plans")
@RequiredArgsConstructor
public class FeePlanController {

    private final FeePlanService feePlanService;

    @PostMapping
    public ResponseEntity<Void> addFeePlan(
            @RequestHeader("X-User-Id") Long ownerId,
            @Valid @RequestBody FeePlanRequest request) {
        feePlanService.addFeePlan(ownerId, request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{feePlanId}")
    public ResponseEntity<Void> deleteFeePlan(
            @RequestHeader("X-User-Id") Long ownerId,
            @PathVariable Long feePlanId) {
        feePlanService.deleteFeePlan(ownerId, feePlanId);
        return ResponseEntity.noContent().build();
    }
}