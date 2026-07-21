package com.fitconnect.gym.controller;

import com.fitconnect.gym.dto.GymPublicResponse;
import com.fitconnect.gym.service.GymService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/gyms")
@RequiredArgsConstructor
public class GymPublicController {

    private final GymService gymService;

    @GetMapping("/{gymId}")
    public ResponseEntity<GymPublicResponse> getGym(@PathVariable Long gymId) {
        return ResponseEntity.ok(gymService.getPublicGym(gymId));
    }

    @GetMapping
    public ResponseEntity<List<GymPublicResponse>> searchGyms(
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(gymService.searchGyms(keyword));
    }
}