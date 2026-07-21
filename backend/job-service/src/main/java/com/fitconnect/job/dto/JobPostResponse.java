package com.fitconnect.job.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class JobPostResponse {
    private Long id;
    private Long gymId;
    private String gymName;
    private String gymAddress;
    private Double gymLatitude;
    private Double gymLongitude;
    private String title;
    private String description;
    private BigDecimal salary;
    private String employmentType;
    private LocalDate postedDate;
    private String status;
    private int applicantCount;
}