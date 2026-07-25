package com.fitconnect.gym.controller;

import com.fitconnect.gym.dto.MediaUploadRequest;
import com.fitconnect.gym.service.FileStorageService;
import com.fitconnect.gym.service.GymMediaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/gyms/me/media")
@RequiredArgsConstructor
public class GymMediaController {

    private final GymMediaService gymMediaService;
    private final FileStorageService fileStorageService;

    @PostMapping
    public ResponseEntity<Void> addMedia(
            @RequestHeader("X-User-Id") Long ownerId,
            @Valid @RequestBody MediaUploadRequest request) {
        gymMediaService.addMedia(ownerId, request);
        return ResponseEntity.ok().build();
    }

    // New: actual file upload from device
    @PostMapping("/upload")
    public ResponseEntity<Void> uploadMedia(
            @RequestHeader("X-User-Id") Long ownerId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") String type,
            @RequestParam(value = "isCover", defaultValue = "false") boolean isCover) {

        String url = fileStorageService.store(file);

        MediaUploadRequest request = new MediaUploadRequest();
        request.setUrl(url);
        request.setType(type);
        request.setCover(isCover);

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