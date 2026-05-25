package com.shopflow.auth_service.service;

import com.shopflow.auth_service.dto.AuthResponse;
import com.shopflow.auth_service.dto.LoginRequest;
import com.shopflow.auth_service.dto.RefreshRequest;
import com.shopflow.auth_service.dto.RegisterRequest;
import com.shopflow.auth_service.dto.UserInfoResponse;
import com.shopflow.auth_service.entity.RefreshToken;
import com.shopflow.auth_service.entity.Role;
import com.shopflow.auth_service.entity.User;
import com.shopflow.auth_service.exception.AuthException;
import com.shopflow.auth_service.repository.RefreshTokenRepository;
import com.shopflow.auth_service.repository.UserRepository;
import com.shopflow.auth_service.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AuthException("El email ya está registrado", HttpStatus.CONFLICT);
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .enabled(true)
                .build();

        userRepository.save(user);
        return generateAuthResponse(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(), request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthException(
                        "Usuario no encontrado", HttpStatus.NOT_FOUND));

        refreshTokenRepository.revokeAllByUser(user);

        return generateAuthResponse(user);
    }

    @Transactional
    public AuthResponse refresh(RefreshRequest request) {
        RefreshToken refreshToken = refreshTokenRepository
                .findByToken(request.getRefreshToken())
                .orElseThrow(() -> new AuthException(
                        "Refresh token no encontrado", HttpStatus.UNAUTHORIZED));

        if (!refreshToken.isValid()) {
            throw new AuthException(
                    "Refresh token expirado o revocado", HttpStatus.UNAUTHORIZED);
        }

        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);

        return generateAuthResponse(refreshToken.getUser());
    }

    @Transactional
    public void logout(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthException(
                        "Usuario no encontrado", HttpStatus.NOT_FOUND));

        refreshTokenRepository.revokeAllByUser(user);
    }

    public UserInfoResponse me(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthException(
                        "Usuario no encontrado", HttpStatus.NOT_FOUND));

        return UserInfoResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .enabled(user.isEnabled())
                .createdAt(user.getCreatedAt().toString())
                .build();
    }

    private AuthResponse generateAuthResponse(User user) {
        String accessToken = jwtUtil.generateAccessToken(user);
        String rawRefreshToken = UUID.randomUUID().toString();

        RefreshToken refreshToken = RefreshToken.builder()
                .token(rawRefreshToken)
                .user(user)
                .expiresAt(Instant.now().plusMillis(refreshTokenExpiration))
                .revoked(false)
                .build();

        refreshTokenRepository.save(refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(rawRefreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtUtil.getAccessTokenExpirationSeconds())
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}