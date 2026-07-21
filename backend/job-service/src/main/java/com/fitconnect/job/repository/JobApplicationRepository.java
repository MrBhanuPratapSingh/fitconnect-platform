package com.fitconnect.job.repository;

import com.fitconnect.job.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByJobPostId(Long jobPostId);
    List<JobApplication> findByApplicantUserId(Long applicantUserId);
    Optional<JobApplication> findByJobPostIdAndApplicantUserId(Long jobPostId, Long applicantUserId);
}