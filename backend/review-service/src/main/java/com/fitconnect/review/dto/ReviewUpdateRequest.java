package com.fitconnect.review.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ReviewUpdateRequest {

    @NotNull @Min(1) @Max(5)
    private Integer rating;

    private String comment;
}