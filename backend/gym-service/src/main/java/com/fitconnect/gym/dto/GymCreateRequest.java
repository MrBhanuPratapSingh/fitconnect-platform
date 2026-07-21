package com.fitconnect.gym.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalTime;

@Data
public class GymCreateRequest {

    @NotBlank
    private String name;

    private String description;

    @NotBlank
    private String address;

    private Double latitude;
    private Double longitude;

    private LocalTime openingTime;
    private LocalTime closingTime;

    private String contactPhone;

    @Email
    private String contactEmail;

    private Integer establishedYear;
}