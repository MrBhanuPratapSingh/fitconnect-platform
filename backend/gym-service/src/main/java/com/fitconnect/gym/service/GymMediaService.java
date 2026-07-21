package com.fitconnect.gym.service;

import com.fitconnect.gym.dto.MediaUploadRequest;
import com.fitconnect.gym.entity.Gym;
import com.fitconnect.gym.entity.GymMedia;
import com.fitconnect.gym.entity.MediaType;
import com.fitconnect.gym.exception.GymNotFoundException;
import com.fitconnect.gym.repository.GymMediaRepository;
import com.fitconnect.gym.repository.GymRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GymMediaService {

    private final GymMediaRepository gymMediaRepository;
    private final GymRepository gymRepository;

    public void addMedia(Long ownerId, MediaUploadRequest request) {
        Gym gym = gymRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new GymNotFoundException("No gym found for this owner"));

        GymMedia media = GymMedia.builder()
                .gym(gym)
                .url(request.getUrl())
                .type(MediaType.valueOf(request.getType().toUpperCase()))
                .isCover(request.isCover())
                .displayOrder(request.getDisplayOrder())
                .build();

        gymMediaRepository.save(media);
    }

    public void deleteMedia(Long ownerId, Long mediaId) {
        Gym gym = gymRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new GymNotFoundException("No gym found for this owner"));

        GymMedia media = gymMediaRepository.findById(mediaId)
                .orElseThrow(() -> new GymNotFoundException("Media not found with id: " + mediaId));

        if (!media.getGym().getId().equals(gym.getId())) {
            throw new IllegalStateException("This media does not belong to your gym");
        }

        gymMediaRepository.delete(media);
    }
}