package com.fitconnect.trainer.repository;

import com.fitconnect.trainer.entity.TrainerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TrainerProfileRepository extends JpaRepository<TrainerProfile, Long> {
    Optional<TrainerProfile> findByTrainerId(Long trainerId);
}