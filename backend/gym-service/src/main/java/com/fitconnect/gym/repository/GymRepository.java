package com.fitconnect.gym.repository;

import com.fitconnect.gym.entity.Gym;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface GymRepository extends JpaRepository<Gym, Long> {
    Optional<Gym> findByOwnerId(Long ownerId);
    List<Gym> findByNameContainingIgnoreCase(String name);
}