package com.fitconnect.job.controller;

import com.fitconnect.job.dto.JobPostResponse;
import com.fitconnect.job.service.JobPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/jobs")
@RequiredArgsConstructor
public class JobPublicController {

    private final JobPostService jobPostService;

    @GetMapping
    public ResponseEntity<List<JobPostResponse>> searchJobs(
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(jobPostService.searchJobs(keyword));
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<JobPostResponse> getJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(jobPostService.getJobById(jobId));
    }
}