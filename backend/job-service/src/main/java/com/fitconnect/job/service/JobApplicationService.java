package com.fitconnect.job.service;

import com.fitconnect.job.dto.*;
import com.fitconnect.job.entity.ApplicationStatus;
import com.fitconnect.job.entity.JobApplication;
import com.fitconnect.job.entity.JobPost;
import com.fitconnect.job.exception.JobNotFoundException;
import com.fitconnect.job.repository.JobApplicationRepository;
import com.fitconnect.job.repository.JobPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final JobPostRepository jobPostRepository;
    private final JobPostService jobPostService;

    public JobApplicationResponse apply(Long jobId, JobApplicationRequest request) {
        JobPost job = jobPostRepository.findById(jobId)
                .orElseThrow(() -> new JobNotFoundException("Job not found with id: " + jobId));

        if (jobApplicationRepository.findByJobPostIdAndApplicantUserId(jobId, request.getApplicantUserId()).isPresent()) {
            throw new IllegalStateException("You have already applied to this job");
        }

        JobApplication application = JobApplication.builder()
                .jobPost(job)
                .applicantUserId(request.getApplicantUserId())
                .applicantName(request.getApplicantName())
                .applicantEmail(request.getApplicantEmail())
                .applicantPhone(request.getApplicantPhone())
                .coverNote(request.getCoverNote())
                .appliedDate(LocalDate.now())
                .status(ApplicationStatus.APPLIED)
                .build();

        return toResponse(jobApplicationRepository.save(application));
    }

    public List<JobApplicationResponse> getApplicationsForJob(Long gymId, Long jobId) {
        jobPostService.verifyOwnership(gymId, jobId);
        return jobApplicationRepository.findByJobPostId(jobId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<JobApplicationResponse> getMyApplications(Long applicantUserId) {
        return jobApplicationRepository.findByApplicantUserId(applicantUserId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public JobApplicationResponse updateStatus(Long gymId, Long applicationId, UpdateApplicationStatusRequest request) {
        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new JobNotFoundException("Application not found with id: " + applicationId));

        if (!application.getJobPost().getGymId().equals(gymId)) {
            throw new IllegalStateException("This application does not belong to your gym's job post");
        }

        application.setStatus(ApplicationStatus.valueOf(request.getStatus().toUpperCase()));
        return toResponse(jobApplicationRepository.save(application));
    }

    private JobApplicationResponse toResponse(JobApplication application) {
        return JobApplicationResponse.builder()
                .id(application.getId())
                .jobPostId(application.getJobPost().getId())
                .jobTitle(application.getJobPost().getTitle())
                .applicantUserId(application.getApplicantUserId())
                .applicantName(application.getApplicantName())
                .applicantEmail(application.getApplicantEmail())
                .applicantPhone(application.getApplicantPhone())
                .coverNote(application.getCoverNote())
                .appliedDate(application.getAppliedDate())
                .status(application.getStatus().name())
                .build();
    }
}