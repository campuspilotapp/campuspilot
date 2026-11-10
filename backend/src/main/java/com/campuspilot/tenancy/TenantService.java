package com.campuspilot.tenancy;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.campuspilot.audit.AuditService;
import com.campuspilot.exception.ApiException;

@Service
public class TenantService {
    private static final String TENANT_SELECT = """
            SELECT id, name, slug, college_type, registration_number, contact_email, phone, address,
                   status, created_at, updated_at
            FROM tenant
            """;

    private final JdbcTemplate jdbcTemplate;
    private final AuditService auditService;
    private final TenantAccessService tenantAccessService;

    public TenantService(
            JdbcTemplate jdbcTemplate, AuditService auditService, TenantAccessService tenantAccessService) {
        this.jdbcTemplate = jdbcTemplate;
        this.auditService = auditService;
        this.tenantAccessService = tenantAccessService;
    }

    @Transactional
    public TenantView create(TenantDetails details, String actorId) {
        String id = UUID.randomUUID().toString();
        try {
            jdbcTemplate.update("""
                    INSERT INTO tenant
                        (id, name, slug, college_type, registration_number, contact_email, phone, address, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')
                    """, id, details.name().trim(), details.slug().trim().toLowerCase(java.util.Locale.ROOT),
                    details.collegeType(), blankToNull(details.registrationNumber()),
                    details.contactEmail().trim().toLowerCase(java.util.Locale.ROOT),
                    blankToNull(details.phone()), blankToNull(details.address()));
        } catch (org.springframework.dao.DuplicateKeyException exception) {
            throw new ApiException(HttpStatus.CONFLICT, "TENANT_SLUG_IN_USE",
                    "A college already exists with this slug.");
        }
        auditService.record(null, actorId, "TENANT_CREATED", "TENANT", id);
        return findById(id);
    }

    @Transactional(readOnly = true)
    public List<TenantView> list() {
        return jdbcTemplate.query(TENANT_SELECT + " ORDER BY created_at DESC LIMIT 500",
                TenantService::mapTenant);
    }

    @Transactional(readOnly = true)
    public TenantView findById(String id) {
        return jdbcTemplate.query(TENANT_SELECT + " WHERE id = ?", TenantService::mapTenant, id)
                .stream()
                .findFirst()
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "TENANT_NOT_FOUND",
                        "The college tenant was not found."));
    }

    @Transactional
    public TenantView update(String id, TenantDetails details, String actorId) {
        try {
            if (jdbcTemplate.update("""
                    UPDATE tenant
                    SET name = ?, slug = ?, college_type = ?, registration_number = ?,
                        contact_email = ?, phone = ?, address = ?
                    WHERE id = ? AND status <> 'SUSPENDED'
                    """, details.name().trim(), details.slug().trim().toLowerCase(java.util.Locale.ROOT),
                    details.collegeType(), blankToNull(details.registrationNumber()),
                    details.contactEmail().trim().toLowerCase(java.util.Locale.ROOT),
                    blankToNull(details.phone()), blankToNull(details.address()), id) == 0) {
                findById(id);
                throw new ApiException(HttpStatus.CONFLICT, "TENANT_SUSPENDED",
                        "A suspended college cannot be edited.");
            }
        } catch (org.springframework.dao.DuplicateKeyException exception) {
            throw new ApiException(HttpStatus.CONFLICT, "TENANT_SLUG_IN_USE",
                    "A college already exists with this slug.");
        }
        auditService.record(id, actorId, "TENANT_UPDATED", "TENANT", id);
        return findById(id);
    }

    @Transactional
    public TenantView activate(String id, String actorId) {
        TenantView tenant = findById(id);
        if ("SUSPENDED".equals(tenant.status())) {
            throw new ApiException(HttpStatus.CONFLICT, "TENANT_SUSPENDED",
                    "A suspended college cannot be activated.");
        }
        if ("ACTIVE".equals(tenant.status())) {
            return tenant;
        }
        Integer invitations = jdbcTemplate.queryForObject("""
                SELECT COUNT(*) FROM tenant_invitation
                WHERE tenant_id = ? AND accepted_at IS NULL AND revoked_at IS NULL
                    AND expires_at > CURRENT_TIMESTAMP(6)
                """, Integer.class, id);
        Integer administrators = jdbcTemplate.queryForObject("""
                SELECT COUNT(*) FROM tenant_membership m
                JOIN membership_role mr ON mr.membership_id = m.id
                JOIN app_role r ON r.id = mr.role_id
                JOIN user_account u ON u.id = m.user_id AND u.status = 'ACTIVE'
                WHERE m.tenant_id = ? AND m.status IN ('PENDING', 'ACTIVE')
                    AND r.code = 'COLLEGE_ADMIN'
                """, Integer.class, id);
        if ((invitations == null || invitations == 0) && (administrators == null || administrators == 0)) {
            throw new ApiException(HttpStatus.CONFLICT, "TENANT_ADMIN_REQUIRED",
                    "Invite or assign a college administrator before activation.");
        }
        jdbcTemplate.update("""
                UPDATE tenant SET status = 'ACTIVE', updated_at = CURRENT_TIMESTAMP(6) WHERE id = ?
                """, id);
        jdbcTemplate.update("""
                UPDATE tenant_membership m
                JOIN user_account u ON u.id = m.user_id AND u.status = 'ACTIVE'
                SET m.status = 'ACTIVE'
                WHERE m.tenant_id = ? AND m.status = 'PENDING'
                """, id);
        auditService.record(id, actorId, "TENANT_ACTIVATED", "TENANT", id);
        return findById(id);
    }

    @Transactional(readOnly = true)
    public SetupStatus setupStatus(String userId, String selectedTenantId) {
        TenantAccessService.TenantContext tenant =
                tenantAccessService.requireActiveTenant(userId, selectedTenantId);
        return new SetupStatus(tenant.id(), tenant.name(), List.of("institution-profile"));
    }

    private static TenantView mapTenant(java.sql.ResultSet result, int rowNumber) throws java.sql.SQLException {
        Timestamp createdAt = result.getTimestamp("created_at");
        Timestamp updatedAt = result.getTimestamp("updated_at");
        return new TenantView(
                result.getString("id"),
                result.getString("name"),
                result.getString("slug"),
                result.getString("college_type"),
                result.getString("registration_number"),
                result.getString("contact_email"),
                result.getString("phone"),
                result.getString("address"),
                result.getString("status"),
                createdAt == null ? null : createdAt.toInstant(),
                updatedAt == null ? null : updatedAt.toInstant());
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    public record TenantDetails(
            String name,
            String slug,
            String collegeType,
            String registrationNumber,
            String contactEmail,
            String phone,
            String address) {}

    public record TenantView(
            String id,
            String name,
            String slug,
            String collegeType,
            String registrationNumber,
            String contactEmail,
            String phone,
            String address,
            String status,
            Instant createdAt,
            Instant updatedAt) {}

    public record SetupStatus(String tenantId, String collegeName, List<String> completedSteps) {}
}
