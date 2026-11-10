package com.campuspilot.security;

import java.util.ArrayList;
import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CampusPilotUserDetailsService implements UserDetailsService {
    private static final String USER_QUERY = """
            SELECT u.id, u.normalized_email, u.password_hash, u.status,
                   GROUP_CONCAT(DISTINCT platform_role.code) AS platform_roles,
                   GROUP_CONCAT(DISTINCT tenant_role.code) AS tenant_roles,
                   GROUP_CONCAT(DISTINCT permission.code) AS permissions
            FROM user_account u
            LEFT JOIN platform_user_role pur ON pur.user_id = u.id
            LEFT JOIN app_role platform_role ON platform_role.id = pur.role_id
            LEFT JOIN role_permission platform_rp ON platform_rp.role_id = platform_role.id
            LEFT JOIN tenant_membership tm ON tm.user_id = u.id AND tm.status = 'ACTIVE'
            LEFT JOIN tenant t ON t.id = tm.tenant_id AND t.status = 'ACTIVE'
            LEFT JOIN membership_role mr ON mr.membership_id = tm.id AND t.id IS NOT NULL
            LEFT JOIN app_role tenant_role ON tenant_role.id = mr.role_id
            LEFT JOIN role_permission tenant_rp ON tenant_rp.role_id = tenant_role.id
            LEFT JOIN permission ON permission.id = platform_rp.permission_id
                                OR permission.id = tenant_rp.permission_id
            WHERE u.normalized_email = ?
            GROUP BY u.id
            """;

    private final JdbcTemplate jdbcTemplate;

    public CampusPilotUserDetailsService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        List<CampusPilotPrincipal> users = jdbcTemplate.query(
                USER_QUERY,
                (result, rowNumber) -> {
                    String status = result.getString("status");
                    List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                    addRoles(authorities, result.getString("platform_roles"));
                    addRoles(authorities, result.getString("tenant_roles"));
                    addAuthorities(authorities, result.getString("permissions"));
                    return new CampusPilotPrincipal(
                            result.getString("id"),
                            result.getString("normalized_email"),
                            result.getString("password_hash") == null ? "" : result.getString("password_hash"),
                            "ACTIVE".equals(status),
                            true,
                            authorities);
                },
                normalizeEmail(username));
        if (users.isEmpty()) {
            throw new UsernameNotFoundException("Invalid email or password");
        }
        return users.getFirst();
    }

    private static void addRoles(List<SimpleGrantedAuthority> authorities, String roles) {
        if (roles != null) {
            for (String role : roles.split(",")) {
                authorities.add(new SimpleGrantedAuthority("ROLE_" + role));
            }
        }
    }

    private static void addAuthorities(List<SimpleGrantedAuthority> authorities, String permissions) {
        if (permissions != null) {
            for (String permission : permissions.split(",")) {
                authorities.add(new SimpleGrantedAuthority(permission));
            }
        }
    }

    public static String normalizeEmail(String email) {
        return email.trim().toLowerCase(java.util.Locale.ROOT);
    }
}
