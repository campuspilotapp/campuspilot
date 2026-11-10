package com.campuspilot.tenancy;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import java.sql.ResultSet;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import com.campuspilot.exception.ApiException;

class TenantAccessServiceTest {
    @Test
    void resolvesOnlyMembershipsBelongingToAuthenticatedUser() {
        JdbcTemplate jdbc = new StubJdbcTemplate();
        TenantAccessService service = new TenantAccessService(jdbc);

        var tenant = service.requireSoleActiveTenant("user-a");

        assertEquals("tenant-a", tenant.id());
    }

    @Test
    void deniesUserWithoutActiveTenantMembership() {
        JdbcTemplate jdbc = new StubJdbcTemplate();
        TenantAccessService service = new TenantAccessService(jdbc);

        ApiException exception = assertThrows(ApiException.class,
                () -> service.requireSoleActiveTenant("user-b"));

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatus());
    }

    @Test
    void deniesTenantSelectionOutsideAuthenticatedMemberships() {
        TenantAccessService service = new TenantAccessService(new StubJdbcTemplate());

        ApiException exception = assertThrows(ApiException.class,
                () -> service.requireActiveTenant("user-a", "tenant-b"));

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatus());
    }

    private static class StubJdbcTemplate extends JdbcTemplate {
        @Override
        public <T> List<T> query(String sql, RowMapper<T> rowMapper, Object... args) {
            if ("user-a".equals(args[0]) && (args.length == 1 || "tenant-a".equals(args[1]))) {
                try {
                    ResultSet resultSet = mock(ResultSet.class);
                    when(resultSet.getString("id")).thenReturn("tenant-a");
                    when(resultSet.getString("name")).thenReturn("College A");
                    return List.of(rowMapper.mapRow(resultSet, 0));
                } catch (java.sql.SQLException exception) {
                    throw new AssertionError(exception);
                }
            }
            return List.of();
        }
    }
}
