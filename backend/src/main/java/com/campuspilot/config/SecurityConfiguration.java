package com.campuspilot.config;

import java.util.Arrays;
import java.util.List;
import java.time.Duration;
import tools.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.web.access.intercept.RequestAuthorizationContext;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.session.web.http.CookieSerializer;
import org.springframework.session.web.http.CookieSerializer.CookieValue;
import org.springframework.session.web.http.DefaultCookieSerializer;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableScheduling
public class SecurityConfiguration {
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    DaoAuthenticationProvider daoAuthenticationProvider(
            UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }

    @Bean
    CookieSerializer cookieSerializer(
            @Value("${server.servlet.session.cookie.secure:true}") boolean secureCookie) {
        DefaultCookieSerializer serializer = new DefaultCookieSerializer() {
            @Override
            public void writeCookieValue(CookieValue cookieValue) {
                if (cookieValue.getRequest().getAttribute("CAMPUSPILOT_REMEMBER_ME") != null) {
                    cookieValue.setCookieMaxAge((int) Duration.ofDays(14).toSeconds());
                }
                super.writeCookieValue(cookieValue);
            }
        };
        serializer.setCookieName("CAMPUSPILOT_SESSION");
        serializer.setUseHttpOnlyCookie(true);
        serializer.setUseSecureCookie(secureCookie);
        serializer.setSameSite("Lax");
        serializer.setRememberMeRequestAttribute("CAMPUSPILOT_REMEMBER_ME");
        return serializer;
    }

    @Bean
    SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            DaoAuthenticationProvider authenticationProvider,
            SecurityContextRepository securityContextRepository,
            ObjectMapper objectMapper,
            JdbcTemplate jdbcTemplate) throws Exception {
        http
                .authenticationProvider(authenticationProvider)
                .securityContext(context -> context.securityContextRepository(securityContextRepository))
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                        .sessionFixation(fixation -> fixation.migrateSession()))
                .csrf(csrf -> csrf
                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                        .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler()))
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/v1/auth/csrf", "/api/v1/auth/login",
                                "/api/v1/auth/invitations/accept",
                                "/api/v1/auth/password-reset-requests",
                                "/api/v1/auth/password-resets",
                                "/api/v1/auth/forgot-password",
                                "/api/v1/auth/verify-reset-otp",
                                "/api/v1/auth/reset-password").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/auth/me").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/logout").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/tenant-selection").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/v1/platform/tenants", "/api/v1/platform/tenants/*")
                        .access(hasPlatformPermission(jdbcTemplate, "platform:tenants:read"))
                        .requestMatchers(HttpMethod.POST, "/api/v1/platform/tenants")
                        .access(hasPlatformPermission(jdbcTemplate, "platform:tenants:create"))
                        .requestMatchers(HttpMethod.PATCH, "/api/v1/platform/tenants/*")
                        .access(hasPlatformPermission(jdbcTemplate, "platform:tenants:update"))
                        .requestMatchers(HttpMethod.POST, "/api/v1/platform/tenants/*/admin-invitations")
                        .access(hasPlatformPermission(jdbcTemplate, "platform:tenants:invite-admin"))
                        .requestMatchers(HttpMethod.POST, "/api/v1/platform/tenants/*/activate")
                        .access(hasPlatformPermission(jdbcTemplate, "platform:tenants:activate"))
                        .requestMatchers("/api/v1/college/**").hasAuthority("college:setup:read")
                        .anyRequest().denyAll())
                .exceptionHandling(errors -> errors
                        .authenticationEntryPoint((request, response, exception) -> {
                            response.setStatus(HttpStatus.UNAUTHORIZED.value());
                            response.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
                            ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                                    HttpStatus.UNAUTHORIZED, "Authentication is required.");
                            problem.setProperty("code", "AUTHENTICATION_REQUIRED");
                            objectMapper.writeValue(response.getOutputStream(), problem);
                        })
                        .accessDeniedHandler((request, response, exception) -> {
                            response.setStatus(HttpStatus.FORBIDDEN.value());
                            response.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
                            ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                                    HttpStatus.FORBIDDEN, "This account does not have permission for this action.");
                            problem.setProperty("code", "ACCESS_DENIED");
                            objectMapper.writeValue(response.getOutputStream(), problem);
                        }));
        return http.build();
    }

    private static AuthorizationManager<RequestAuthorizationContext> hasPlatformPermission(
            JdbcTemplate jdbcTemplate, String permission) {
        return (authentication, context) -> {
            if (!(authentication.get().getPrincipal() instanceof
                    com.campuspilot.security.CampusPilotPrincipal principal)) {
                return new AuthorizationDecision(false);
            }
            Integer matches = jdbcTemplate.queryForObject("""
                    SELECT COUNT(*)
                    FROM user_account u
                    JOIN platform_user_role pur ON pur.user_id = u.id
                    JOIN app_role r ON r.id = pur.role_id AND r.code = 'SUPER_ADMIN'
                    JOIN role_permission rp ON rp.role_id = r.id
                    JOIN permission p ON p.id = rp.permission_id AND p.code = ?
                    WHERE u.id = ? AND u.status = 'ACTIVE'
                    """, Integer.class, permission, principal.id());
            return new AuthorizationDecision(matches != null && matches > 0);
        };
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource(
            @Value("${app.cors.allowed-origins}") String allowedOrigins) {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isEmpty())
                .toList());
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Content-Type", "X-XSRF-TOKEN", "X-Correlation-ID"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}
