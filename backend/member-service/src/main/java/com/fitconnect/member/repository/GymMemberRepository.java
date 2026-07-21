package com.fitconnect.member.repository;

import com.fitconnect.member.entity.GymMember;
import com.fitconnect.member.entity.MemberStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GymMemberRepository extends JpaRepository<GymMember, Long> {
    List<GymMember> findByGymId(Long gymId);
    List<GymMember> findByGymIdAndStatus(Long gymId, MemberStatus status);
}