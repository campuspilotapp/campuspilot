package com.campuspilot.identity;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import com.campuspilot.security.CampusPilotUserDetailsService;
import com.campuspilot.security.TokenService;

@Service
public class LoginRateLimiter {
    private static final int MAX_ATTEMPTS = 5;
    private static final int MAX_ACCOUNT_ATTEMPTS = 10;
    private static final int MAX_IP_ATTEMPTS = 25;

    private final JdbcTemplate jdbcTemplate;
    private final TokenService tokenService;

    public LoginRateLimiter(JdbcTemplate jdbcTemplate, TokenService tokenService) {
        this.jdbcTemplate = jdbcTemplate;
        this.tokenService = tokenService;
    }

    public String key(String email, String remoteAddress) {
        return tokenService.hash("pair|" + CampusPilotUserDetailsService.normalizeEmail(email) + "|" + remoteAddress);
    }

    public String accountKey(String email) {
        return tokenService.hash("account|" + CampusPilotUserDetailsService.normalizeEmail(email));
    }

    public String resetKey(String email, String remoteAddress) {
        return tokenService.hash("reset|" + CampusPilotUserDetailsService.normalizeEmail(email) + "|" + remoteAddress);
    }

    public String ipKey(String remoteAddress) {
        return tokenService.hash("ip|" + remoteAddress);
    }

    public boolean isBlocked(String rateKey) {
        Integer matches = jdbcTemplate.queryForObject("""
                SELECT COUNT(*) FROM auth_rate_limit
                WHERE rate_key = ? AND blocked_until > CURRENT_TIMESTAMP(6)
                """, Integer.class, rateKey);
        return matches != null && matches > 0;
    }

    public void recordFailure(String rateKey) {
        recordFailure(rateKey, MAX_ATTEMPTS);
    }

    public void recordFailure(String rateKey, int maxAttempts) {
        jdbcTemplate.update("""
                INSERT INTO auth_rate_limit (rate_key, window_started_at, attempt_count, blocked_until)
                VALUES (?, CURRENT_TIMESTAMP(6), 1, NULL)
                ON DUPLICATE KEY UPDATE
                    attempt_count = IF(
                        window_started_at < CURRENT_TIMESTAMP(6) - INTERVAL 15 MINUTE,
                        1,
                        attempt_count + 1
                    ),
                    blocked_until = IF(
                        window_started_at < CURRENT_TIMESTAMP(6) - INTERVAL 15 MINUTE,
                        NULL,
                        IF(attempt_count >= ?, CURRENT_TIMESTAMP(6) + INTERVAL 15 MINUTE, blocked_until)
                    ),
                    window_started_at = IF(
                        window_started_at < CURRENT_TIMESTAMP(6) - INTERVAL 15 MINUTE,
                        CURRENT_TIMESTAMP(6),
                        window_started_at
                    )
                """, rateKey, maxAttempts);
    }

    public int accountAttemptLimit() {
        return MAX_ACCOUNT_ATTEMPTS;
    }

    public int ipAttemptLimit() {
        return MAX_IP_ATTEMPTS;
    }

    public void recordSuccess(String rateKey) {
        jdbcTemplate.update("DELETE FROM auth_rate_limit WHERE rate_key = ?", rateKey);
    }
}
