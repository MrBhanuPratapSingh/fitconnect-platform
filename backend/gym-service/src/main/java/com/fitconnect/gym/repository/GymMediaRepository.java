package com.fitconnect.gym.repository;

import com.fitconnect.gym.entity.GymMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GymMediaRepository extends JpaRepository<GymMedia, Long> {
    List<GymMedia> findByGymIdOrderByDisplayOrderAsc(Long gymId);
}