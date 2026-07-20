package com.fitconnect.auth.repository;

import com.fitconnect.auth.entity.Role;
import com.fitconnect.auth.entity.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleName name);
}