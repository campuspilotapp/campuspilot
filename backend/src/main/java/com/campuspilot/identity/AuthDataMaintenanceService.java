package com.campuspilot.identity;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class AuthDataMaintenanceService {
    private final JdbcTemplate jdbcTemplate;

    public AuthDataMaintenanceService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Scheduled(cron = "0 15 * * * *")
    public void removeExpiredAuthenticationData() {
        jdbcTemplate.update("""
                DELETE FROM auth_rate_limit
                WHERE window_started_at < CURRENT_TIMESTAMP(6) - INTERVAL 1 DAY
                """);
        jdbcTemplate.update("""
                DELETE FROM password_reset_otp
                WHERE expires_at < CURRENT_TIMESTAMP(6) - INTERVAL 1 DAY
                    OR consumed_at < CURRENT_TIMESTAMP(6) - INTERVAL 1 DAY
                """);
    }
}
