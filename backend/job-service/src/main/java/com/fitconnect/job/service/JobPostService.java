package com.fitconnect.job.service;

import com.fitconnect.job.dto.*;
import com.fitconnect.job.entity.EmploymentType;
import com.fitconnect.job.entity.JobPost;
import com.fitconnect.job.entity.JobStatus;
import com.fitconnect.job.exception.JobNotFoundException;
import com.fitconnect.job.repository.JobPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobPostService {

    private final JobPostRepository jobPostRepository;

    public JobPostResponse createJob(Long gymId, JobPostCreateRequest request) {
        JobPost job = JobPost.builder()
                .gymId(gymId)
                .gymName(request.getGymName())
                .gymAddress(request.getGymAddress())
                .gymLatitude(request.getGymLatitude())
                .gymLongitude(request.getGymLongitude())
                .title(request.getTitle())
                .description(request.getDescription())
                .salary(request.getSalary())
                .employmentType(EmploymentType.valueOf(request.getEmploymentType().toUpperCase()))
                .postedDate(LocalDate.now())
                .status(JobStatus.OPEN)
                .build();

        return toResponse(jobPostRepository.save(job));
    }

    public List<JobPostResponse> getJobsForGym(Long gymId) {
        return jobPostRepository.findByGymId(gymId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public JobPostResponse closeJob(Long gymId, Long jobId) {
        JobPost job = verifyOwnership(gymId, jobId);
        job.setStatus(JobStatus.CLOSED);
        return toResponse(jobPostRepository.save(job));
    }

    // ===== Public search (for trainers) =====

    public List<JobPostResponse> searchJobs(String keyword) {
        List<JobPost> jobs = (keyword == null || keyword.isBlank())
                ? jobPostRepository.findByStatus(JobStatus.OPEN)
                : jobPostRepository.findByStatusAndTitleContainingIgnoreCase(JobStatus.OPEN, keyword);

        return jobs.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public JobPostResponse getJobById(Long jobId) {
        return toResponse(jobPostRepository.findById(jobId)
                .orElseThrow(() -> new JobNotFoundException("Job not found with id: " + jobId)));
    }

    JobPost verifyOwnership(Long gymId, Long jobId) {
        JobPost job = jobPostRepository.findById(jobId)
                .orElseThrow(() -> new JobNotFoundException("Job not found with id: " + jobId));

        if (!job.getGymId().equals(gymId)) {
            throw new IllegalStateException("This job post does not belong to your gym");
        }
        return job;
    }

    private JobPostResponse toResponse(JobPost job) {
        return JobPostResponse.builder()
                .id(job.getId())
                .gymId(job.getGymId())
                .gymName(job.getGymName())
                .gymAddress(job.getGymAddress())
                .gymLatitude(job.getGymLatitude())
                .gymLongitude(job.getGymLongitude())
                .title(job.getTitle())
                .description(job.getDescription())
                .salary(job.getSalary())
                .employmentType(job.getEmploymentType().name())
                .postedDate(job.getPostedDate())
                .status(job.getStatus().name())
                .applicantCount(job.getApplications().size())
                .build();
    }
}