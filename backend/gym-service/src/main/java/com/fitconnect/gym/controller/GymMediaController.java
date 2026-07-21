package com.fitconnect.gym.controller;

import com.fitconnect.gym.dto.MediaUploadRequest;
import com.fitconnect.gym.service.GymMediaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gyms/me/media")
@RequiredArgsConstructor
public class GymMediaController {

    private final GymMediaService gymMediaService;

    @PostMapping
    public ResponseEntity<Void> addMedia(
            @RequestHeader("X-User-Id") Long ownerId,
            @Valid @RequestBody MediaUploadRequest request) {
        gymMediaService.addMedia(ownerId, request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{mediaId}")
    public ResponseEntity<Void> deleteMedia(
            @RequestHeader("X-User-Id") Long ownerId,
            @PathVariable Long mediaId) {
        gymMediaService.deleteMedia(ownerId, mediaId);
        return ResponseEntity.noContent().build();
    }
}