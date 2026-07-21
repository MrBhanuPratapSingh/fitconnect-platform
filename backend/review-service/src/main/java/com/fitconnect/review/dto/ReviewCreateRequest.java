package com.fitconnect.review.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ReviewCreateRequest {

    @NotNull
    private Long userId;

    @NotBlank
    private String userName;

    @NotNull @Min(1) @Max(5)
    private Integer rating;

    private String comment;
}