package com.campuspilot.identity;

import java.security.SecureRandom;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import com.campuspilot.audit.AuditService;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.campuspilot.exception.ApiException;
import com.campuspilot.security.CampusPilotUserDetailsService;

@Service
public class PasswordResetService {
    private static final int MAX_ATTEMPTS = 5;

    private final JdbcTemplate jdbcTemplate;
    private final PasswordEncoder passwordEncoder;
    private final EmailDeliveryService emailDeliveryService;
    private final LoginRateLimiter rateLimiter;
    private final SessionRevocationService sessionRevocationService;
    private final AuditService auditService;
    private final SecureRandom secureRandom = new SecureRandom();

    public PasswordResetService(
            JdbcTemplate jdbcTemplate,
            PasswordEncoder passwordEncoder,
            EmailDeliveryService emailDeliveryService,
            LoginRateLimiter rateLimiter,
            SessionRevocationService sessionRevocationService,
            AuditService auditService) {
        this.jdbcTemplate = jdbcTemplate;
        this.passwordEncoder = passwordEncoder;
        this.emailDeliveryService = emailDeliveryService;
        this.rateLimiter = rateLimiter;
        this.sessionRevocationService = sessionRevocationService;
        this.auditService = auditService;
    }

    @Transactional
    public void requestCode(String email, String remoteAddress) {
        emailDeliveryService.requireConfigured();
        String normalizedEmail = CampusPilotUserDetailsService.normalizeEmail(email);
        String rateKey = rateLimiter.resetKey(normalizedEmail, remoteAddress);
        if (rateLimiter.isBlocked(rateKey)) {
            throw new ApiException(HttpStatus.TOO_MANY_REQUESTS, "RESET_RATE_LIMITED",
                    "Too many reset requests. Try again later.");
        }
        rateLimiter.recordFailure(rateKey);

        List<String> users = jdbcTemplate.query("""
                SELECT id FROM user_account
                WHERE normalized_email = ? AND status = 'ACTIVE' AND email_verified_at IS NOT NULL
                """, (result, rowNumber) -> result.getString("id"), normalizedEmail);
        if (users.isEmpty()) {
            return;
        }
        String userId = users.getFirst();
        Integer recentRequests = jdbcTemplate.queryForObject("""
                SELECT COUNT(*) FROM password_reset_otp
                WHERE user_id = ? AND created_at > CURRENT_TIMESTAMP(6) - INTERVAL 1 HOUR
                """, Integer.class, userId);
        if (recentRequests != null && recentRequests >= 3) {
            return;
        }

        String code = String.format(Locale.ROOT, "%06d", secureRandom.nextInt(1_000_000));
        jdbcTemplate.update("""
                UPDATE password_reset_otp SET consumed_at = CURRENT_TIMESTAMP(6)
                WHERE user_id = ? AND consumed_at IS NULL
                """, userId);
        jdbcTemplate.update("""
                INSERT INTO password_reset_otp (id, user_id, otp_hash, expires_at)
                VALUES (?, ?, ?, ?)
                """, UUID.randomUUID().toString(), userId, passwordEncoder.encode(code),
                Timestamp.from(Instant.now().plus(5, ChronoUnit.MINUTES)));
        emailDeliveryService.sendPasswordReset(email, code);
    }

    @Transactional(noRollbackFor = ApiException.class)
    public void verifyCode(String email, String code) {
        ResetOtp otp = findActiveOtp(email);
        if (!otp.expiresAt().isAfter(Instant.now()) || otp.failedAttempts() >= MAX_ATTEMPTS) {
            consume(otp.id());
            throw invalidCode();
        }
        if (!passwordEncoder.matches(code, otp.hash())) {
            recordFailedAttempt(otp);
            throw invalidCode();
        }
    }

    @Transactional(noRollbackFor = ApiException.class)
    public void resetPassword(String email, String code, String newPassword) {
        if (newPassword == null || newPassword.length() < 12 || newPassword.length() > 128) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "PASSWORD_POLICY",
                    "Set a password between 12 and 128 characters.");
        }
        String normalizedEmail = CampusPilotUserDetailsService.normalizeEmail(email);
        ResetOtp otp = findActiveOtp(normalizedEmail);
        if (!otp.expiresAt().isAfter(Instant.now()) || otp.failedAttempts() >= MAX_ATTEMPTS) {
            consume(otp.id());
            throw invalidCode();
        }
        if (!passwordEncoder.matches(code, otp.hash())) {
            recordFailedAttempt(otp);
            throw invalidCode();
        }

        jdbcTemplate.update("""
                UPDATE user_account SET password_hash = ? WHERE id = ?
                """, passwordEncoder.encode(newPassword), otp.userId());
        consume(otp.id());
        jdbcTemplate.update("""
                DELETE FROM password_reset_otp WHERE user_id = ? AND id <> ? AND consumed_at IS NULL
                """, otp.userId(), otp.id());
        sessionRevocationService.revokeAll(normalizedEmail);
        auditService.record(null, otp.userId(), "PASSWORD_RESET_COMPLETED", "USER_ACCOUNT", otp.userId());
    }

    private ResetOtp findActiveOtp(String email) {
        String normalizedEmail = CampusPilotUserDetailsService.normalizeEmail(email);
        var otpRows = jdbcTemplate.query("""
                SELECT o.id, o.user_id, o.otp_hash, o.expires_at, o.failed_attempts, u.normalized_email
                FROM password_reset_otp o
                JOIN user_account u ON u.id = o.user_id
                WHERE u.normalized_email = ? AND o.consumed_at IS NULL
                ORDER BY o.created_at DESC
                LIMIT 1 FOR UPDATE
                """, (result, rowNumber) -> new ResetOtp(
                        result.getString("id"),
                        result.getString("user_id"),
                        result.getString("otp_hash"),
                        result.getTimestamp("expires_at").toInstant(),
                        result.getInt("failed_attempts")), normalizedEmail);
        if (otpRows.isEmpty()) {
            throw invalidCode();
        }
        return otpRows.getFirst();
    }

    private void recordFailedAttempt(ResetOtp otp) {
        int attempts = otp.failedAttempts() + 1;
        jdbcTemplate.update("""
                UPDATE password_reset_otp SET failed_attempts = ?,
                    consumed_at = IF(? >= ?, CURRENT_TIMESTAMP(6), consumed_at)
                WHERE id = ?
                """, attempts, attempts, MAX_ATTEMPTS, otp.id());
    }

    private void consume(String otpId) {
        jdbcTemplate.update("UPDATE password_reset_otp SET consumed_at = CURRENT_TIMESTAMP(6) WHERE id = ?", otpId);
    }

    private static ApiException invalidCode() {
        return new ApiException(HttpStatus.BAD_REQUEST, "RESET_CODE_INVALID",
                "The reset code is invalid, expired, or has already been used.");
    }

    private record ResetOtp(String id, String userId, String hash, Instant expiresAt, int failedAttempts) {}
}
