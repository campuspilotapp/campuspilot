package com.campuspilot.audit;

import java.util.UUID;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class AuditService {
    private final JdbcTemplate jdbcTemplate;

    public AuditService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void record(String tenantId, String actorId, String action, String resourceType, String resourceId) {
        jdbcTemplate.update("""
                INSERT INTO audit_event (id, tenant_id, actor_user_id, action, resource_type, resource_id)
                VALUES (?, ?, ?, ?, ?, ?)
                """, UUID.randomUUID().toString(), tenantId, actorId, action, resourceType, resourceId);
    }
}
