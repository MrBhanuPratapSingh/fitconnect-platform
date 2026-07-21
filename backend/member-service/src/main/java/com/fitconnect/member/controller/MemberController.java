package com.fitconnect.member.controller;

import com.fitconnect.member.dto.MemberCreateRequest;
import com.fitconnect.member.dto.MemberResponse;
import com.fitconnect.member.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @PostMapping
    public ResponseEntity<MemberResponse> addMember(
            @RequestHeader("X-Gym-Id") Long gymId,
            @Valid @RequestBody MemberCreateRequest request) {
        return ResponseEntity.ok(memberService.addMember(gymId, request));
    }

    @GetMapping
    public ResponseEntity<List<MemberResponse>> getMembers(@RequestHeader("X-Gym-Id") Long gymId) {
        return ResponseEntity.ok(memberService.getMembers(gymId));
    }

    @GetMapping("/{memberId}")
    public ResponseEntity<MemberResponse> getMember(
            @RequestHeader("X-Gym-Id") Long gymId,
            @PathVariable Long memberId) {
        return ResponseEntity.ok(memberService.getMember(gymId, memberId));
    }

    @PatchMapping("/{memberId}/deactivate")
    public ResponseEntity<Void> removeMember(
            @RequestHeader("X-Gym-Id") Long gymId,
            @PathVariable Long memberId) {
        memberService.removeMember(gymId, memberId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{memberId}")
    public ResponseEntity<Void> deleteMember(
            @RequestHeader("X-Gym-Id") Long gymId,
            @PathVariable Long memberId) {
        memberService.deleteMemberPermanently(gymId, memberId);
        return ResponseEntity.noContent().build();
    }
}