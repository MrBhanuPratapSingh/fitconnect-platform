package com.fitconnect.gym.repository;

import com.fitconnect.gym.entity.FeePlan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FeePlanRepository extends JpaRepository<FeePlan, Long> {
    List<FeePlan> findByGymId(Long gymId);
}