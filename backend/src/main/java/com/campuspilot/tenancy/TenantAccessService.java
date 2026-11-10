package com.campuspilot.tenancy;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import com.campuspilot.exception.ApiException;

@Service
public class TenantAccessService {
    private final JdbcTemplate jdbcTemplate;

    public TenantAccessService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public TenantContext requireSoleActiveTenant(String userId) {
        return requireActiveTenant(userId, null);
    }

    public TenantContext requireActiveTenant(String userId, String selectedTenantId) {
        String query = """
                SELECT DISTINCT t.id, t.name, t.status
                FROM tenant t
                JOIN tenant_membership m ON m.tenant_id = t.id
                JOIN user_account u ON u.id = m.user_id AND u.status = 'ACTIVE'
                JOIN membership_role mr ON mr.membership_id = m.id
                JOIN app_role r ON r.id = mr.role_id
                JOIN role_permission rp ON rp.role_id = r.id
                JOIN permission p ON p.id = rp.permission_id AND p.code = 'college:setup:read'
                WHERE m.user_id = ? AND m.status = 'ACTIVE' AND t.status = 'ACTIVE'
                """ + (selectedTenantId == null ? "" : " AND t.id = ?") + " ORDER BY t.name";
        List<TenantContext> tenants;
        if (selectedTenantId == null) {
            tenants = jdbcTemplate.query(query, TenantAccessService::mapTenant, userId);
        } else {
            tenants = jdbcTemplate.query(query, TenantAccessService::mapTenant, userId, selectedTenantId);
        }

        if (tenants.isEmpty()) {
            throw new ApiException(HttpStatus.FORBIDDEN,
                    selectedTenantId == null ? "ACTIVE_TENANT_REQUIRED" : "TENANT_ACCESS_DENIED",
                    selectedTenantId == null
                            ? "No active college membership is available for this account."
                            : "This account does not have an active membership in the selected college.");
        }
        if (tenants.size() > 1) {
            throw new ApiException(HttpStatus.CONFLICT, "TENANT_SELECTION_REQUIRED",
                    "Select an active college before using college features.");
        }
        return tenants.getFirst();
    }

    private static TenantContext mapTenant(java.sql.ResultSet result, int rowNumber)
            throws java.sql.SQLException {
        return new TenantContext(result.getString("id"), result.getString("name"));
    }

    public record TenantContext(String id, String name) {}
}
