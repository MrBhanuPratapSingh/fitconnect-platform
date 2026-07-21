package com.fitconnect.member.service;

import com.fitconnect.member.dto.*;
import com.fitconnect.member.entity.GymMember;
import com.fitconnect.member.entity.MemberStatus;
import com.fitconnect.member.exception.MemberNotFoundException;
import com.fitconnect.member.repository.GymMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final GymMemberRepository gymMemberRepository;

    public MemberResponse addMember(Long gymId, MemberCreateRequest request) {
        GymMember member = GymMember.builder()
                .gymId(gymId)
                .userId(request.getUserId())
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .joinDate(request.getJoinDate())
                .feePlanId(request.getFeePlanId())
                .status(MemberStatus.ACTIVE)
                .build();

        return toResponse(gymMemberRepository.save(member));
    }

    public List<MemberResponse> getMembers(Long gymId) {
        return gymMemberRepository.findByGymId(gymId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public MemberResponse getMember(Long gymId, Long memberId) {
        GymMember member = findAndVerifyOwnership(gymId, memberId);
        return toResponse(member);
    }

    public void removeMember(Long gymId, Long memberId) {
        GymMember member = findAndVerifyOwnership(gymId, memberId);
        member.setStatus(MemberStatus.INACTIVE);
        gymMemberRepository.save(member);
    }

    public void deleteMemberPermanently(Long gymId, Long memberId) {
        GymMember member = findAndVerifyOwnership(gymId, memberId);
        gymMemberRepository.delete(member);
    }

    private GymMember findAndVerifyOwnership(Long gymId, Long memberId) {
        GymMember member = gymMemberRepository.findById(memberId)
                .orElseThrow(() -> new MemberNotFoundException("Member not found with id: " + memberId));

        if (!member.getGymId().equals(gymId)) {
            throw new IllegalStateException("This member does not belong to your gym");
        }
        return member;
    }

    private MemberResponse toResponse(GymMember member) {
        return MemberResponse.builder()
                .id(member.getId())
                .gymId(member.getGymId())
                .userId(member.getUserId())
                .fullName(member.getFullName())
                .phone(member.getPhone())
                .email(member.getEmail())
                .joinDate(member.getJoinDate())
                .status(member.getStatus().name())
                .feePlanId(member.getFeePlanId())
                .build();
    }
}