package com.fitconnect.trainer.repository;

import com.fitconnect.trainer.entity.Trainer;
import com.fitconnect.trainer.entity.TrainerStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TrainerRepository extends JpaRepository<Trainer, Long> {
    List<Trainer> findByGymId(Long gymId);
    List<Trainer> findByGymIdAndStatus(Long gymId, TrainerStatus status);
    Optional<Trainer> findByUserId(Long userId);
}