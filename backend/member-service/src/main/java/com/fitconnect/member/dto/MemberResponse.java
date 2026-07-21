package com.fitconnect.member.dto;

import lombok.*;
import java.time.LocalDate;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class MemberResponse {
    private Long id;
    private Long gymId;
    private Long userId;
    private String fullName;
    private String phone;
    private String email;
    private LocalDate joinDate;
    private String status;
    private Long feePlanId;
}