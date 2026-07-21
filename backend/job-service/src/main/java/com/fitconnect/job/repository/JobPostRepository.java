package com.fitconnect.job.repository;

import com.fitconnect.job.entity.JobPost;
import com.fitconnect.job.entity.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobPostRepository extends JpaRepository<JobPost, Long> {
    List<JobPost> findByGymId(Long gymId);
    List<JobPost> findByStatus(JobStatus status);
    List<JobPost> findByStatusAndTitleContainingIgnoreCase(JobStatus status, String title);
}