package com.fitconnect.search.dto;

import lombok.Data;
import java.time.LocalTime;
import java.util.List;

@Data
public class GymPublicDto {
    private Long id;
    private String name;
    private String description;
    private String address;
    private Double latitude;
    private Double longitude;
    private LocalTime openingTime;
    private LocalTime closingTime;
    private String contactPhone;
    private String contactEmail;
    private Integer establishedYear;
    private List<FeePlanDto> feePlans;
}