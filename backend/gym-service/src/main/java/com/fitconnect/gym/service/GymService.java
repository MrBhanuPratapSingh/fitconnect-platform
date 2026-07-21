package com.fitconnect.gym.service;

import com.fitconnect.gym.dto.*;
import com.fitconnect.gym.entity.*;
import com.fitconnect.gym.exception.GymNotFoundException;
import com.fitconnect.gym.repository.GymRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GymService {

    private final GymRepository gymRepository;

    public GymResponse createGym(Long ownerId, GymCreateRequest request) {
        if (gymRepository.findByOwnerId(ownerId).isPresent()) {
            throw new IllegalStateException("This owner already has a gym registered");
        }

        Gym gym = Gym.builder()
                .ownerId(ownerId)
                .name(request.getName())
                .description(request.getDescription())
                .address(request.getAddress())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .openingTime(request.getOpeningTime())
                .closingTime(request.getClosingTime())
                .contactPhone(request.getContactPhone())
                .contactEmail(request.getContactEmail())
                .establishedYear(request.getEstablishedYear())
                .build();

        Gym saved = gymRepository.save(gym);
        return toResponse(saved);
    }

    public GymResponse getMyGym(Long ownerId) {
        Gym gym = gymRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new GymNotFoundException("No gym found for this owner"));
        return toResponse(gym);
    }

    public GymResponse updateGym(Long ownerId, GymCreateRequest request) {
        Gym gym = gymRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new GymNotFoundException("No gym found for this owner"));

        gym.setName(request.getName());
        gym.setDescription(request.getDescription());
        gym.setAddress(request.getAddress());
        gym.setLatitude(request.getLatitude());
        gym.setLongitude(request.getLongitude());
        gym.setOpeningTime(request.getOpeningTime());
        gym.setClosingTime(request.getClosingTime());
        gym.setContactPhone(request.getContactPhone());
        gym.setContactEmail(request.getContactEmail());
        gym.setEstablishedYear(request.getEstablishedYear());

        return toResponse(gymRepository.save(gym));
    }

    public GymPublicResponse getPublicGym(Long gymId) {
        Gym gym = gymRepository.findById(gymId)
                .orElseThrow(() -> new GymNotFoundException("Gym not found with id: " + gymId));
        return toPublicResponse(gym);
    }

    public List<GymPublicResponse> searchGyms(String keyword) {
        List<Gym> gyms = (keyword == null || keyword.isBlank())
                ? gymRepository.findAll()
                : gymRepository.findByNameContainingIgnoreCase(keyword);

        return gyms.stream().map(this::toPublicResponse).collect(Collectors.toList());
    }

    // ===== Mapping helpers =====

    private GymResponse toResponse(Gym gym) {
        return GymResponse.builder()
                .id(gym.getId())
                .ownerId(gym.getOwnerId())
                .name(gym.getName())
                .description(gym.getDescription())
                .address(gym.getAddress())
                .latitude(gym.getLatitude())
                .longitude(gym.getLongitude())
                .openingTime(gym.getOpeningTime())
                .closingTime(gym.getClosingTime())
                .contactPhone(gym.getContactPhone())
                .contactEmail(gym.getContactEmail())
                .establishedYear(gym.getEstablishedYear())
                .media(mapMedia(gym))
                .feePlans(mapFeePlans(gym))
                .achievements(mapAchievements(gym))
                .build();
    }

    private GymPublicResponse toPublicResponse(Gym gym) {
        return GymPublicResponse.builder()
                .id(gym.getId())
                .name(gym.getName())
                .description(gym.getDescription())
                .address(gym.getAddress())
                .latitude(gym.getLatitude())
                .longitude(gym.getLongitude())
                .openingTime(gym.getOpeningTime())
                .closingTime(gym.getClosingTime())
                .contactPhone(gym.getContactPhone())
                .contactEmail(gym.getContactEmail())
                .establishedYear(gym.getEstablishedYear())
                .media(mapMedia(gym))
                .feePlans(mapFeePlans(gym))
                .achievements(mapAchievements(gym))
                .build();
    }

    private List<GymMediaResponse> mapMedia(Gym gym) {
        return gym.getMedia().stream()
                .map(m -> GymMediaResponse.builder()
                        .id(m.getId())
                        .url(m.getUrl())
                        .type(m.getType().name())
                        .isCover(m.isCover())
                        .displayOrder(m.getDisplayOrder())
                        .build())
                .collect(Collectors.toList());
    }

    private List<FeePlanResponse> mapFeePlans(Gym gym) {
        return gym.getFeePlans().stream()
                .map(f -> FeePlanResponse.builder()
                        .id(f.getId())
                        .planName(f.getPlanName())
                        .amount(f.getAmount())
                        .billingCycle(f.getBillingCycle().name())
                        .build())
                .collect(Collectors.toList());
    }

    private List<AchievementResponse> mapAchievements(Gym gym) {
        return gym.getAchievements().stream()
                .map(a -> AchievementResponse.builder()
                        .id(a.getId())
                        .title(a.getTitle())
                        .description(a.getDescription())
                        .achievedOn(a.getAchievedOn())
                        .build())
                .collect(Collectors.toList());
    }
}