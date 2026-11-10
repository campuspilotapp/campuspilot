package com.campuspilot.identity;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "app.bootstrap.enabled", havingValue = "true")
public class SuperAdminBootstrapRunner implements ApplicationRunner {
    private final InvitationService invitationService;
    private final String email;

    public SuperAdminBootstrapRunner(
            InvitationService invitationService,
            @Value("${app.bootstrap.email}") String email) {
        this.invitationService = invitationService;
        this.email = email;
    }

    @Override
    public void run(ApplicationArguments arguments) {
        if (email.isBlank()) {
            throw new IllegalStateException(
                    "BOOTSTRAP_SUPER_ADMIN_EMAIL is required when BOOTSTRAP_SUPER_ADMIN_ENABLED=true.");
        }
        invitationService.bootstrapSuperAdmin(email);
    }
}
