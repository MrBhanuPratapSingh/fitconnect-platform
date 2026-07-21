package com.fitconnect.job.controller;

import com.fitconnect.job.dto.*;
import com.fitconnect.job.service.JobApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    // Trainer applies to a job
    @PostMapping("/{jobId}/apply")
    public ResponseEntity<JobApplicationResponse> apply(
            @PathVariable Long jobId,
            @Valid @RequestBody JobApplicationRequest request) {
        return ResponseEntity.ok(jobApplicationService.apply(jobId, request));
    }

    // Owner views applicants for their job post
    @GetMapping("/{jobId}/applications")
    public ResponseEntity<List<JobApplicationResponse>> getApplicationsForJob(
            @RequestHeader("X-Gym-Id") Long gymId,
            @PathVariable Long jobId) {
        return ResponseEntity.ok(jobApplicationService.getApplicationsForJob(gymId, jobId));
    }

    // Trainer views their own applications
    @GetMapping("/applications/mine")
    public ResponseEntity<List<JobApplicationResponse>> getMyApplications(
            @RequestParam Long applicantUserId) {
        return ResponseEntity.ok(jobApplicationService.getMyApplications(applicantUserId));
    }

    // Owner updates an applicant's status
    @PatchMapping("/applications/{applicationId}/status")
    public ResponseEntity<JobApplicationResponse> updateStatus(
            @RequestHeader("X-Gym-Id") Long gymId,
            @PathVariable Long applicationId,
            @Valid @RequestBody UpdateApplicationStatusRequest request) {
        return ResponseEntity.ok(jobApplicationService.updateStatus(gymId, applicationId, request));
    }
}