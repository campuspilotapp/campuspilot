package com.campuspilot.identity;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import java.util.List;
import java.time.Duration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.campuspilot.exception.ApiException;
import com.campuspilot.audit.AuditService;
import com.campuspilot.security.CampusPilotPrincipal;
import com.campuspilot.security.CampusPilotUserDetailsService;
import com.campuspilot.tenancy.TenantAccessService;

@Validated
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private static final int DEFAULT_SESSION_TIMEOUT_SECONDS = (int) Duration.ofMinutes(30).toSeconds();
    private static final int REMEMBERED_SESSION_TIMEOUT_SECONDS = (int) Duration.ofDays(14).toSeconds();

    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;
    private final LoginRateLimiter loginRateLimiter;
    private final PasswordResetService passwordResetService;
    private final InvitationService invitationService;
    private final JdbcTemplate jdbcTemplate;
    private final AuditService auditService;
    private final TenantAccessService tenantAccessService;

    public AuthController(
            AuthenticationManager authenticationManager,
            SecurityContextRepository securityContextRepository,
            LoginRateLimiter loginRateLimiter,
            PasswordResetService passwordResetService,
            InvitationService invitationService,
            JdbcTemplate jdbcTemplate,
            AuditService auditService,
            TenantAccessService tenantAccessService) {
        this.authenticationManager = authenticationManager;
        this.securityContextRepository = securityContextRepository;
        this.loginRateLimiter = loginRateLimiter;
        this.passwordResetService = passwordResetService;
        this.invitationService = invitationService;
        this.jdbcTemplate = jdbcTemplate;
        this.auditService = auditService;
        this.tenantAccessService = tenantAccessService;
    }

    @GetMapping("/csrf")
    public CsrfResponse csrf(CsrfToken csrfToken) {
        return new CsrfResponse(csrfToken.getToken());
    }

    @PostMapping("/login")
    public CurrentUser login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest servletRequest,
            HttpServletResponse servletResponse) {
        String normalizedEmail = CampusPilotUserDetailsService.normalizeEmail(request.email());
        String remoteAddress = servletRequest.getRemoteAddr();
        String rateKey = loginRateLimiter.key(normalizedEmail, remoteAddress);
        String accountRateKey = loginRateLimiter.accountKey(normalizedEmail);
        String ipRateKey = loginRateLimiter.ipKey(remoteAddress);
        if (loginRateLimiter.isBlocked(rateKey)
                || loginRateLimiter.isBlocked(accountRateKey)
                || loginRateLimiter.isBlocked(ipRateKey)) {
            throw new ApiException(HttpStatus.TOO_MANY_REQUESTS, "LOGIN_RATE_LIMITED",
                    "Too many unsuccessful login attempts. Try again later.");
        }

        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    UsernamePasswordAuthenticationToken.unauthenticated(normalizedEmail, request.password()));
        } catch (AuthenticationException exception) {
            loginRateLimiter.recordFailure(rateKey);
            loginRateLimiter.recordFailure(accountRateKey, loginRateLimiter.accountAttemptLimit());
            loginRateLimiter.recordFailure(ipRateKey, loginRateLimiter.ipAttemptLimit());
            auditService.record(null, null, "LOGIN_FAILED", "AUTHENTICATION", rateKey);
            throw new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS",
                    "The email or password is incorrect.");
        }
        loginRateLimiter.recordSuccess(rateKey);
        loginRateLimiter.recordSuccess(accountRateKey);
        HttpSession session = servletRequest.getSession(true);
        session.setMaxInactiveInterval(request.rememberMe()
                ? REMEMBERED_SESSION_TIMEOUT_SECONDS
                : DEFAULT_SESSION_TIMEOUT_SECONDS);
        if (request.rememberMe()) {
            servletRequest.setAttribute("CAMPUSPILOT_REMEMBER_ME", Boolean.TRUE);
        }
        servletRequest.changeSessionId();
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, servletRequest, servletResponse);
        CampusPilotPrincipal user = (CampusPilotPrincipal) authentication.getPrincipal();
        auditService.record(null, user.id(), "LOGIN_SUCCEEDED", "USER_ACCOUNT", user.id());
        return currentUser(user);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        SecurityContextHolder.clearContext();
        var session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public CurrentUser me(@AuthenticationPrincipal CampusPilotPrincipal user) {
        return currentUser(user);
    }

    @PostMapping("/tenant-selection")
    public TenantSelectionResponse selectTenant(
            @Valid @RequestBody TenantSelectionRequest request,
            @AuthenticationPrincipal CampusPilotPrincipal user,
            HttpSession session) {
        var tenant = tenantAccessService.requireActiveTenant(user.id(), request.tenantId());
        session.setAttribute("CAMPUSPILOT_ACTIVE_TENANT", tenant.id());
        return new TenantSelectionResponse(tenant.id(), tenant.name());
    }

    @PostMapping("/invitations/accept")
    public ResponseEntity<Void> acceptInvitation(@Valid @RequestBody AcceptInvitationRequest request) {
        invitationService.accept(request.token(), request.password());
        return ResponseEntity.noContent().build();
    }

    @PostMapping({"/password-reset-requests", "/forgot-password"})
    public ResponseEntity<ResetRequestResponse> requestPasswordReset(
            @Valid @RequestBody PasswordResetRequest request,
            HttpServletRequest servletRequest) {
        passwordResetService.requestCode(request.email(), servletRequest.getRemoteAddr());
        return ResponseEntity.accepted()
                .body(new ResetRequestResponse("If the account is eligible, a reset code will be sent."));
    }

    @PostMapping("/verify-reset-otp")
    public ResponseEntity<Void> verifyPasswordResetOtp(@Valid @RequestBody VerifyPasswordResetOtpRequest request) {
        passwordResetService.verifyCode(request.email(), request.code());
        return ResponseEntity.noContent().build();
    }

    @PostMapping({"/password-resets", "/reset-password"})
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody CompletePasswordResetRequest request) {
        passwordResetService.resetPassword(request.email(), request.code(), request.newPassword());
        return ResponseEntity.noContent().build();
    }

    private CurrentUser currentUser(CampusPilotPrincipal user) {
        List<Membership> memberships = jdbcTemplate.query("""
                SELECT t.id, t.name, t.status, m.status AS membership_status
                FROM tenant_membership m
                JOIN tenant t ON t.id = m.tenant_id
                WHERE m.user_id = ?
                ORDER BY t.name
                """, (result, rowNumber) -> new Membership(
                result.getString("id"),
                result.getString("name"),
                result.getString("status"),
                result.getString("membership_status")), user.id());
        List<String> authorities = user.getAuthorities().stream()
                .map(authority -> authority.getAuthority())
                .sorted()
                .toList();
        return new CurrentUser(user.id(), user.getUsername(), authorities, memberships);
    }

    public record LoginRequest(
            @NotBlank @Email @Size(max = 254) String email,
            @NotBlank String password,
            boolean rememberMe) {}

    public record AcceptInvitationRequest(
            @NotBlank @Size(max = 128) String token,
            @Size(min = 12, max = 128) String password) {}

    public record PasswordResetRequest(@NotBlank @Email @Size(max = 254) String email) {}

    public record VerifyPasswordResetOtpRequest(
            @NotBlank @Email @Size(max = 254) String email,
            @NotBlank @Pattern(regexp = "[0-9]{6}") String code) {}

    public record TenantSelectionRequest(@NotBlank @Size(max = 36) String tenantId) {}

    public record CompletePasswordResetRequest(
            @NotBlank @Email @Size(max = 254) String email,
            @NotBlank @Pattern(regexp = "[0-9]{6}") String code,
            @NotBlank @Size(min = 12, max = 128) String newPassword) {}

    public record CsrfResponse(String token) {}

    public record ResetRequestResponse(String message) {}

    public record CurrentUser(String id, String email, List<String> authorities, List<Membership> memberships) {}

    public record Membership(String tenantId, String collegeName, String tenantStatus, String membershipStatus) {}

    public record TenantSelectionResponse(String tenantId, String collegeName) {}
}
