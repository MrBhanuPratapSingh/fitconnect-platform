package com.fitconnect.gym.service;

import com.fitconnect.gym.dto.FeePlanRequest;
import com.fitconnect.gym.entity.BillingCycle;
import com.fitconnect.gym.entity.FeePlan;
import com.fitconnect.gym.entity.Gym;
import com.fitconnect.gym.exception.GymNotFoundException;
import com.fitconnect.gym.repository.FeePlanRepository;
import com.fitconnect.gym.repository.GymRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FeePlanService {

    private final FeePlanRepository feePlanRepository;
    private final GymRepository gymRepository;

    public void addFeePlan(Long ownerId, FeePlanRequest request) {
        Gym gym = gymRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new GymNotFoundException("No gym found for this owner"));

        FeePlan feePlan = FeePlan.builder()
                .gym(gym)
                .planName(request.getPlanName())
                .amount(request.getAmount())
                .billingCycle(BillingCycle.valueOf(request.getBillingCycle().toUpperCase()))
                .build();

        feePlanRepository.save(feePlan);
    }

    public void deleteFeePlan(Long ownerId, Long feePlanId) {
        Gym gym = gymRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new GymNotFoundException("No gym found for this owner"));

        FeePlan feePlan = feePlanRepository.findById(feePlanId)
                .orElseThrow(() -> new GymNotFoundException("Fee plan not found with id: " + feePlanId));

        if (!feePlan.getGym().getId().equals(gym.getId())) {
            throw new IllegalStateException("This fee plan does not belong to your gym");
        }

        feePlanRepository.delete(feePlan);
    }
}