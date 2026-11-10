package com.campuspilot.identity;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SessionRevocationService {
    private final JdbcTemplate jdbcTemplate;

    public SessionRevocationService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional
    public void revokeAll(String normalizedEmail) {
        jdbcTemplate.update("""
                DELETE FROM SPRING_SESSION
                WHERE PRINCIPAL_NAME = ?
                """, normalizedEmail);
    }
}
