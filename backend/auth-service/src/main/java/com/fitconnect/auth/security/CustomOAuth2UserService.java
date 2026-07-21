package com.fitconnect.auth.security;

import com.fitconnect.auth.entity.AppUser;
import com.fitconnect.auth.entity.Role;
import com.fitconnect.auth.entity.RoleName;
import com.fitconnect.auth.repository.RoleRepository;
import com.fitconnect.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends OidcUserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    @Transactional
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        OidcUser oidcUser = super.loadUser(userRequest);

        log.info(">>> CustomOAuth2UserService (OIDC) TRIGGERED");
        log.info(">>> Google attributes received: {}", oidcUser.getAttributes());

        String email = oidcUser.getAttribute("email");
        String name = oidcUser.getAttribute("name");
        String googleId = oidcUser.getAttribute("sub");

        if (email == null) {
            throw new OAuth2AuthenticationException("Google did not return an email address");
        }

        AppUser user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            log.info(">>> Creating new user for email: {}", email);

            Role defaultRole = roleRepository.findByName(RoleName.USER)
                    .orElseThrow(() -> new IllegalStateException("Role not found: seed roles table first"));

            user = AppUser.builder()
                    .fullName(name)
                    .email(email)
                    .provider("GOOGLE")
                    .providerId(googleId)
                    .roles(Set.of(defaultRole))
                    .build();

            user = userRepository.saveAndFlush(user);
            log.info(">>> User saved with id: {}", user.getId());
        } else {
            log.info(">>> Existing user found: {}", user.getEmail());
        }

        return oidcUser;
    }
}