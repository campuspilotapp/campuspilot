CREATE TABLE tenant (
    id CHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    slug VARCHAR(80) NOT NULL,
    college_type VARCHAR(40) NOT NULL,
    registration_number VARCHAR(100),
    contact_email VARCHAR(254) NOT NULL,
    phone VARCHAR(40),
    address VARCHAR(500),
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
        ON UPDATE CURRENT_TIMESTAMP(6),
    CONSTRAINT UQ_tenant_slug UNIQUE (slug),
    CONSTRAINT CK_tenant_status CHECK (status IN ('PENDING', 'ACTIVE', 'SUSPENDED')),
    CONSTRAINT CK_tenant_college_type CHECK (
        college_type IN ('ENGINEERING', 'ARTS_SCIENCE', 'BED_MED', 'MANAGEMENT_STUDIES')
    )
) ENGINE=InnoDB;

CREATE TABLE user_account (
    id CHAR(36) NOT NULL PRIMARY KEY,
    email VARCHAR(254) NOT NULL,
    normalized_email VARCHAR(254) NOT NULL,
    password_hash VARCHAR(100),
    status VARCHAR(20) NOT NULL,
    email_verified_at TIMESTAMP(6),
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
        ON UPDATE CURRENT_TIMESTAMP(6),
    CONSTRAINT UQ_user_account_normalized_email UNIQUE (normalized_email),
    CONSTRAINT CK_user_account_status CHECK (status IN ('PENDING', 'ACTIVE', 'DISABLED'))
) ENGINE=InnoDB;

CREATE TABLE app_role (
    id CHAR(36) NOT NULL PRIMARY KEY,
    code VARCHAR(80) NOT NULL,
    role_scope VARCHAR(20) NOT NULL,
    CONSTRAINT UQ_role_code UNIQUE (code),
    CONSTRAINT CK_role_scope CHECK (role_scope IN ('PLATFORM', 'TENANT'))
) ENGINE=InnoDB;

CREATE TABLE permission (
    id CHAR(36) NOT NULL PRIMARY KEY,
    code VARCHAR(120) NOT NULL,
    description VARCHAR(255) NOT NULL,
    CONSTRAINT UQ_permission_code UNIQUE (code)
) ENGINE=InnoDB;

CREATE TABLE role_permission (
    role_id CHAR(36) NOT NULL,
    permission_id CHAR(36) NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT FK_role_permission_role FOREIGN KEY (role_id) REFERENCES app_role (id),
    CONSTRAINT FK_role_permission_permission FOREIGN KEY (permission_id) REFERENCES permission (id)
) ENGINE=InnoDB;

CREATE TABLE platform_user_role (
    user_id CHAR(36) NOT NULL,
    role_id CHAR(36) NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT FK_platform_user_role_user FOREIGN KEY (user_id) REFERENCES user_account (id),
    CONSTRAINT FK_platform_user_role_role FOREIGN KEY (role_id) REFERENCES app_role (id)
) ENGINE=InnoDB;

CREATE TABLE tenant_membership (
    id CHAR(36) NOT NULL PRIMARY KEY,
    tenant_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT UQ_tenant_membership UNIQUE (tenant_id, user_id),
    CONSTRAINT CK_tenant_membership_status CHECK (status IN ('PENDING', 'ACTIVE', 'SUSPENDED')),
    CONSTRAINT FK_tenant_membership_tenant FOREIGN KEY (tenant_id) REFERENCES tenant (id),
    CONSTRAINT FK_tenant_membership_user FOREIGN KEY (user_id) REFERENCES user_account (id),
    INDEX IX_tenant_membership_user (user_id)
) ENGINE=InnoDB;

CREATE TABLE membership_role (
    membership_id CHAR(36) NOT NULL,
    role_id CHAR(36) NOT NULL,
    PRIMARY KEY (membership_id, role_id),
    CONSTRAINT FK_membership_role_membership FOREIGN KEY (membership_id) REFERENCES tenant_membership (id),
    CONSTRAINT FK_membership_role_role FOREIGN KEY (role_id) REFERENCES app_role (id)
) ENGINE=InnoDB;

CREATE TABLE tenant_invitation (
    id CHAR(36) NOT NULL PRIMARY KEY,
    tenant_id CHAR(36) NOT NULL,
    email VARCHAR(254) NOT NULL,
    normalized_email VARCHAR(254) NOT NULL,
    token_hash CHAR(64) NOT NULL,
    expires_at TIMESTAMP(6) NOT NULL,
    accepted_at TIMESTAMP(6),
    revoked_at TIMESTAMP(6),
    invited_by CHAR(36) NOT NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT UQ_tenant_invitation_token_hash UNIQUE (token_hash),
    CONSTRAINT FK_tenant_invitation_tenant FOREIGN KEY (tenant_id) REFERENCES tenant (id),
    CONSTRAINT FK_tenant_invitation_inviter FOREIGN KEY (invited_by) REFERENCES user_account (id),
    INDEX IX_tenant_invitation_email (tenant_id, normalized_email),
    INDEX IX_tenant_invitation_expiry (expires_at)
) ENGINE=InnoDB;

CREATE TABLE platform_invitation (
    id CHAR(36) NOT NULL PRIMARY KEY,
    email VARCHAR(254) NOT NULL,
    normalized_email VARCHAR(254) NOT NULL,
    token_hash CHAR(64) NOT NULL,
    expires_at TIMESTAMP(6) NOT NULL,
    accepted_at TIMESTAMP(6),
    revoked_at TIMESTAMP(6),
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT UQ_platform_invitation_token_hash UNIQUE (token_hash),
    INDEX IX_platform_invitation_email (normalized_email),
    INDEX IX_platform_invitation_expiry (expires_at)
) ENGINE=InnoDB;

CREATE TABLE password_reset_otp (
    id CHAR(36) NOT NULL PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    otp_hash VARCHAR(100) NOT NULL,
    expires_at TIMESTAMP(6) NOT NULL,
    failed_attempts INT NOT NULL DEFAULT 0,
    consumed_at TIMESTAMP(6),
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT FK_password_reset_otp_user FOREIGN KEY (user_id) REFERENCES user_account (id),
    INDEX IX_password_reset_otp_user (user_id, expires_at)
) ENGINE=InnoDB;

CREATE TABLE auth_rate_limit (
    rate_key CHAR(64) NOT NULL PRIMARY KEY,
    window_started_at TIMESTAMP(6) NOT NULL,
    attempt_count INT NOT NULL,
    blocked_until TIMESTAMP(6),
    INDEX IX_auth_rate_limit_window (window_started_at)
) ENGINE=InnoDB;

CREATE TABLE audit_event (
    id CHAR(36) NOT NULL PRIMARY KEY,
    tenant_id CHAR(36),
    actor_user_id CHAR(36),
    action VARCHAR(120) NOT NULL,
    resource_type VARCHAR(80) NOT NULL,
    resource_id VARCHAR(100),
    correlation_id VARCHAR(100),
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT FK_audit_event_tenant FOREIGN KEY (tenant_id) REFERENCES tenant (id),
    CONSTRAINT FK_audit_event_actor FOREIGN KEY (actor_user_id) REFERENCES user_account (id),
    INDEX IX_audit_event_tenant_created (tenant_id, created_at),
    INDEX IX_audit_event_actor_created (actor_user_id, created_at)
) ENGINE=InnoDB;

CREATE TABLE SPRING_SESSION (
    PRIMARY_ID CHAR(36) NOT NULL,
    SESSION_ID CHAR(36) NOT NULL,
    CREATION_TIME BIGINT NOT NULL,
    LAST_ACCESS_TIME BIGINT NOT NULL,
    MAX_INACTIVE_INTERVAL INT NOT NULL,
    EXPIRY_TIME BIGINT NOT NULL,
    PRINCIPAL_NAME VARCHAR(254),
    CONSTRAINT SPRING_SESSION_PK PRIMARY KEY (PRIMARY_ID),
    CONSTRAINT SPRING_SESSION_IX1 UNIQUE (SESSION_ID),
    INDEX SPRING_SESSION_IX2 (EXPIRY_TIME),
    INDEX SPRING_SESSION_IX3 (PRINCIPAL_NAME)
) ENGINE=InnoDB;

CREATE TABLE SPRING_SESSION_ATTRIBUTES (
    SESSION_PRIMARY_ID CHAR(36) NOT NULL,
    ATTRIBUTE_NAME VARCHAR(200) NOT NULL,
    ATTRIBUTE_BYTES BLOB NOT NULL,
    CONSTRAINT SPRING_SESSION_ATTRIBUTES_PK PRIMARY KEY (SESSION_PRIMARY_ID, ATTRIBUTE_NAME),
    CONSTRAINT SPRING_SESSION_ATTRIBUTES_FK FOREIGN KEY (SESSION_PRIMARY_ID)
        REFERENCES SPRING_SESSION (PRIMARY_ID) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO app_role (id, code, role_scope) VALUES
    ('00000000-0000-0000-0000-000000000001', 'SUPER_ADMIN', 'PLATFORM'),
    ('00000000-0000-0000-0000-000000000002', 'COLLEGE_ADMIN', 'TENANT');

INSERT INTO permission (id, code, description) VALUES
    ('00000000-0000-0000-0000-000000000101', 'platform:tenants:read', 'View college tenants'),
    ('00000000-0000-0000-0000-000000000102', 'platform:tenants:create', 'Create college tenants'),
    ('00000000-0000-0000-0000-000000000103', 'platform:tenants:update', 'Update college tenants'),
    ('00000000-0000-0000-0000-000000000104', 'platform:tenants:activate', 'Activate college tenants'),
    ('00000000-0000-0000-0000-000000000105', 'platform:tenants:invite-admin', 'Invite college administrators'),
    ('00000000-0000-0000-0000-000000000201', 'college:setup:read', 'View institution setup status');

INSERT INTO role_permission (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000001', id FROM permission
WHERE code LIKE 'platform:tenants:%';

INSERT INTO role_permission (role_id, permission_id)
VALUES ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000201');
