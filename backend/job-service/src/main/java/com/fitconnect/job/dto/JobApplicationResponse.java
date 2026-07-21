package com.fitconnect.job.dto;

import lombok.*;
import java.time.LocalDate;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class JobApplicationResponse {
    private Long id;
    private Long jobPostId;
    private String jobTitle;
    private Long applicantUserId;
    private String applicantName;
    private String applicantEmail;
    private String applicantPhone;
    private String coverNote;
    private LocalDate appliedDate;
    private String status;
}