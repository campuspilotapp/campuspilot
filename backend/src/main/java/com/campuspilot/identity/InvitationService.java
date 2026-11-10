package com.campuspilot.identity;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.campuspilot.audit.AuditService;
import com.campuspilot.exception.ApiException;
import com.campuspilot.security.CampusPilotUserDetailsService;
import com.campuspilot.security.TokenService;
import jakarta.mail.internet.AddressException;
import jakarta.mail.internet.InternetAddress;

@Service
public class InvitationService {
    private static final String SUPER_ADMIN_ROLE_ID = "00000000-0000-0000-0000-000000000001";
    private static final String COLLEGE_ADMIN_ROLE_ID = "00000000-0000-0000-0000-000000000002";
    private static final String SUPER_ADMIN_ROLE_CODE = "SUPER_ADMIN";
    private static final String COLLEGE_ADMIN_ROLE_CODE = "COLLEGE_ADMIN";

    private final JdbcTemplate jdbcTemplate;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;
    private final EmailDeliveryService emailDeliveryService;
    private final AuditService auditService;

    public InvitationService(
            JdbcTemplate jdbcTemplate,
            TokenService tokenService,
            PasswordEncoder passwordEncoder,
            EmailDeliveryService emailDeliveryService,
            AuditService auditService) {
        this.jdbcTemplate = jdbcTemplate;
        this.tokenService = tokenService;
        this.passwordEncoder = passwordEncoder;
        this.emailDeliveryService = emailDeliveryService;
        this.auditService = auditService;
    }

    @Transactional
    public InvitationCreated createTenantInvitation(String tenantId, String email, String actorId) {
        emailDeliveryService.requireConfigured();
        String normalizedEmail = CampusPilotUserDetailsService.normalizeEmail(email);
        String tenantStatus = jdbcTemplate.query("""
                SELECT status FROM tenant WHERE id = ?
                """, result -> result.next() ? result.getString(1) : null, tenantId);
        if (tenantStatus == null) {
            throw new ApiException(HttpStatus.NOT_FOUND, "TENANT_NOT_FOUND", "The college tenant was not found.");
        }
        if ("SUSPENDED".equals(tenantStatus)) {
            throw new ApiException(HttpStatus.CONFLICT, "TENANT_SUSPENDED",
                    "A suspended college cannot receive administrator invitations.");
        }

        jdbcTemplate.update("""
                UPDATE tenant_invitation
                SET revoked_at = CURRENT_TIMESTAMP(6)
                WHERE tenant_id = ? AND normalized_email = ?
                    AND accepted_at IS NULL AND revoked_at IS NULL
                """, tenantId, normalizedEmail);

        String token = tokenService.newToken();
        String invitationId = UUID.randomUUID().toString();
        jdbcTemplate.update("""
                INSERT INTO tenant_invitation
                    (id, tenant_id, email, normalized_email, token_hash, expires_at, invited_by)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """, invitationId, tenantId, email.trim(), normalizedEmail, tokenService.hash(token),
                Timestamp.from(Instant.now().plus(48, ChronoUnit.HOURS)), actorId);
        auditService.record(tenantId, actorId, "TENANT_ADMIN_INVITED", "TENANT_INVITATION", invitationId);
        emailDeliveryService.sendInvitation(email.trim(), token);
        return new InvitationCreated(invitationId, "SENT");
    }

    @Transactional
    public void bootstrapSuperAdmin(String email) {
        validateEmail(email);
        emailDeliveryService.requireConfigured();
        jdbcTemplate.queryForObject("SELECT id FROM app_role WHERE code = ? FOR UPDATE", String.class,
                SUPER_ADMIN_ROLE_CODE);
        Integer admins = jdbcTemplate.queryForObject("""
                SELECT COUNT(*) FROM platform_user_role pur
                JOIN app_role r ON r.id = pur.role_id
                WHERE r.code = 'SUPER_ADMIN'
                """, Integer.class);
        if (admins != null && admins > 0) {
            return;
        }

        String normalizedEmail = CampusPilotUserDetailsService.normalizeEmail(email);
        Integer pendingInvitations = jdbcTemplate.queryForObject("""
                SELECT COUNT(*) FROM platform_invitation
                WHERE accepted_at IS NULL AND revoked_at IS NULL
                    AND expires_at > CURRENT_TIMESTAMP(6)
                """, Integer.class);
        if (pendingInvitations != null && pendingInvitations > 0) {
            return;
        }
        jdbcTemplate.update("""
                UPDATE platform_invitation SET revoked_at = CURRENT_TIMESTAMP(6)
                WHERE accepted_at IS NULL AND revoked_at IS NULL
                """);
        String token = tokenService.newToken();
        String invitationId = UUID.randomUUID().toString();
        jdbcTemplate.update("""
                INSERT INTO platform_invitation
                    (id, email, normalized_email, token_hash, expires_at)
                VALUES (?, ?, ?, ?, ?)
                """, invitationId, email.trim(), normalizedEmail, tokenService.hash(token),
                Timestamp.from(Instant.now().plus(48, ChronoUnit.HOURS)));
        emailDeliveryService.sendPlatformInvitation(email.trim(), token);
    }

    @Transactional
    public void accept(String token, String password) {
        String tokenHash = tokenService.hash(token);
        var platformInvitation = jdbcTemplate.query("""
                SELECT id, email, normalized_email, expires_at, accepted_at, revoked_at
                FROM platform_invitation WHERE token_hash = ?
                """, (result, rowNumber) -> new InvitationRow(
                        result.getString("id"),
                        result.getString("email"),
                        result.getString("normalized_email"),
                        result.getTimestamp("expires_at").toInstant(),
                        result.getTimestamp("accepted_at") != null,
                        result.getTimestamp("revoked_at") != null), tokenHash)
                .stream().findFirst();
        if (platformInvitation.isPresent()) {
            jdbcTemplate.queryForObject("SELECT id FROM app_role WHERE code = ? FOR UPDATE", String.class,
                    SUPER_ADMIN_ROLE_CODE);
            InvitationRow lockedInvitation = jdbcTemplate.query("""
                    SELECT id, email, normalized_email, expires_at, accepted_at, revoked_at
                    FROM platform_invitation WHERE id = ? FOR UPDATE
                    """, (result, rowNumber) -> new InvitationRow(
                    result.getString("id"),
                    result.getString("email"),
                    result.getString("normalized_email"),
                    result.getTimestamp("expires_at").toInstant(),
                    result.getTimestamp("accepted_at") != null,
                    result.getTimestamp("revoked_at") != null), platformInvitation.get().id())
                    .stream().findFirst().orElseThrow(() -> invalidInvitation());
            acceptPlatformInvitation(lockedInvitation, password);
            return;
        }

        var tenantInvitation = jdbcTemplate.query("""
                SELECT id, tenant_id, email, normalized_email, expires_at, accepted_at, revoked_at
                FROM tenant_invitation WHERE token_hash = ? FOR UPDATE
                """, (result, rowNumber) -> new TenantInvitationRow(
                        result.getString("id"),
                        result.getString("tenant_id"),
                        result.getString("email"),
                        result.getString("normalized_email"),
                        result.getTimestamp("expires_at").toInstant(),
                        result.getTimestamp("accepted_at") != null,
                        result.getTimestamp("revoked_at") != null), tokenHash)
                .stream().findFirst()
                .orElseThrow(() -> invalidInvitation());
        if (tenantInvitation.accepted() || tenantInvitation.revoked()
                || !tenantInvitation.expiresAt().isAfter(Instant.now())) {
            throw invalidInvitation();
        }

        String userId = findOrCreateInvitedUser(
                tenantInvitation.email(), tenantInvitation.normalizedEmail(), password);
        String tenantStatus = jdbcTemplate.queryForObject(
                "SELECT status FROM tenant WHERE id = ?", String.class, tenantInvitation.tenantId());
        String membershipStatus = "ACTIVE".equals(tenantStatus) ? "ACTIVE" : "PENDING";
        String membershipId = UUID.randomUUID().toString();
        jdbcTemplate.update("""
                INSERT INTO tenant_membership (id, tenant_id, user_id, status)
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE status = VALUES(status)
                """, membershipId, tenantInvitation.tenantId(), userId, membershipStatus);
        String actualMembershipId = jdbcTemplate.queryForObject("""
                SELECT id FROM tenant_membership WHERE tenant_id = ? AND user_id = ?
                """, String.class, tenantInvitation.tenantId(), userId);
        jdbcTemplate.update("""
                INSERT IGNORE INTO membership_role (membership_id, role_id) VALUES (?, ?)
                """, actualMembershipId, COLLEGE_ADMIN_ROLE_ID);
        jdbcTemplate.update("""
                UPDATE tenant_invitation SET accepted_at = CURRENT_TIMESTAMP(6) WHERE id = ?
                """, tenantInvitation.id());
        auditService.record(tenantInvitation.tenantId(), userId, "TENANT_ADMIN_INVITATION_ACCEPTED",
                "TENANT_INVITATION", tenantInvitation.id());
    }

    private void acceptPlatformInvitation(InvitationRow invitation, String password) {
        if (invitation.accepted() || invitation.revoked() || !invitation.expiresAt().isAfter(Instant.now())) {
            throw invalidInvitation();
        }
        Integer admins = jdbcTemplate.queryForObject("""
                SELECT COUNT(*) FROM platform_user_role pur
                JOIN app_role r ON r.id = pur.role_id
                WHERE r.code = 'SUPER_ADMIN'
                """, Integer.class);
        if (admins != null && admins > 0) {
            throw invalidInvitation();
        }
        String userId = findOrCreateInvitedUser(invitation.email(), invitation.normalizedEmail(), password);
        jdbcTemplate.update("INSERT IGNORE INTO platform_user_role (user_id, role_id) VALUES (?, ?)",
                userId, SUPER_ADMIN_ROLE_ID);
        jdbcTemplate.update("""
                UPDATE platform_invitation SET accepted_at = CURRENT_TIMESTAMP(6) WHERE id = ?
                """, invitation.id());
        auditService.record(null, userId, "PLATFORM_ADMIN_INVITATION_ACCEPTED",
                "PLATFORM_INVITATION", invitation.id());
    }

    private String findOrCreateInvitedUser(String email, String normalizedEmail, String password) {
        var existing = jdbcTemplate.query("""
                SELECT id, status, password_hash FROM user_account WHERE normalized_email = ? FOR UPDATE
                """, (result, rowNumber) -> new ExistingUser(
                        result.getString("id"), result.getString("status"), result.getString("password_hash")),
                normalizedEmail).stream().findFirst();
        if (existing.isPresent()) {
            ExistingUser user = existing.get();
            if ("DISABLED".equals(user.status())) {
                throw new ApiException(HttpStatus.CONFLICT, "ACCOUNT_DISABLED",
                        "This account cannot accept an invitation.");
            }
            if (user.passwordHash() == null) {
                requirePassword(password);
                jdbcTemplate.update("""
                        UPDATE user_account SET password_hash = ?, status = 'ACTIVE',
                            email_verified_at = CURRENT_TIMESTAMP(6)
                        WHERE id = ?
                        """, passwordEncoder.encode(password), user.id());
            }
            return user.id();
        }

        requirePassword(password);
        String userId = UUID.randomUUID().toString();
        jdbcTemplate.update("""
                INSERT INTO user_account
                    (id, email, normalized_email, password_hash, status, email_verified_at)
                VALUES (?, ?, ?, ?, 'ACTIVE', CURRENT_TIMESTAMP(6))
                """, userId, email, normalizedEmail, passwordEncoder.encode(password));
        return userId;
    }

    private static void requirePassword(String password) {
        if (password == null || password.length() < 12 || password.length() > 128) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "PASSWORD_POLICY",
                    "Set a password between 12 and 128 characters.");
        }
    }

    private static void validateEmail(String email) {
        try {
            new InternetAddress(email, true).validate();
        } catch (AddressException exception) {
            throw new IllegalStateException("BOOTSTRAP_SUPER_ADMIN_EMAIL must be a valid email address.", exception);
        }
    }

    private static ApiException invalidInvitation() {
        return new ApiException(HttpStatus.BAD_REQUEST, "INVITATION_INVALID",
                "This invitation is invalid, expired, revoked, or already used.");
    }

    public record InvitationCreated(String invitationId, String emailStatus) {}

    private record InvitationRow(
            String id, String email, String normalizedEmail, Instant expiresAt, boolean accepted, boolean revoked) {}

    private record TenantInvitationRow(
            String id,
            String tenantId,
            String email,
            String normalizedEmail,
            Instant expiresAt,
            boolean accepted,
            boolean revoked) {}

    private record ExistingUser(String id, String status, String passwordHash) {}

}
