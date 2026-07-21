package com.fitconnect.job.controller;

import com.fitconnect.job.dto.JobPostCreateRequest;
import com.fitconnect.job.dto.JobPostResponse;
import com.fitconnect.job.service.JobPostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobPostController {

    private final JobPostService jobPostService;

    @PostMapping
    public ResponseEntity<JobPostResponse> createJob(
            @RequestHeader("X-Gym-Id") Long gymId,
            @Valid @RequestBody JobPostCreateRequest request) {
        return ResponseEntity.ok(jobPostService.createJob(gymId, request));
    }

    @GetMapping("/mine")
    public ResponseEntity<List<JobPostResponse>> getMyJobs(@RequestHeader("X-Gym-Id") Long gymId) {
        return ResponseEntity.ok(jobPostService.getJobsForGym(gymId));
    }

    @PatchMapping("/{jobId}/close")
    public ResponseEntity<JobPostResponse> closeJob(
            @RequestHeader("X-Gym-Id") Long gymId,
            @PathVariable Long jobId) {
        return ResponseEntity.ok(jobPostService.closeJob(gymId, jobId));
    }
}