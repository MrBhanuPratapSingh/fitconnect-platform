package com.fitconnect.auth.security;

import com.fitconnect.auth.entity.AppUser;
import com.fitconnect.auth.repository.UserRepository;
import com.fitconnect.auth.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                         Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        log.info(">>> Success handler looking up email: {}", email);

        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException(
                        "User should exist after CustomOAuth2UserService ran. Email was: " + email));

        String role = user.getRoles().iterator().next().getName().name();
        String token = jwtService.generateToken(user.getId(), user.getEmail(), role);

        String redirectUrl = frontendUrl + "/oauth2/redirect?token=" + token;
        response.sendRedirect(redirectUrl);
    }
}