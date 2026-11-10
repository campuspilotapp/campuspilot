package com.campuspilot.tenancy;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import com.campuspilot.identity.InvitationService;
import com.campuspilot.security.CampusPilotPrincipal;

@RestController
@RequestMapping("/api/v1")
public class TenantController {
    private final TenantService tenantService;
    private final InvitationService invitationService;

    public TenantController(TenantService tenantService, InvitationService invitationService) {
        this.tenantService = tenantService;
        this.invitationService = invitationService;
    }

    @GetMapping("/platform/tenants")
    public List<TenantService.TenantView> listTenants() {
        return tenantService.list();
    }

    @PostMapping("/platform/tenants")
    @ResponseStatus(HttpStatus.CREATED)
    public TenantService.TenantView createTenant(
            @Valid @RequestBody TenantDetailsRequest request,
            @AuthenticationPrincipal CampusPilotPrincipal actor) {
        return tenantService.create(request.toDetails(), actor.id());
    }

    @GetMapping("/platform/tenants/{tenantId}")
    public TenantService.TenantView getTenant(@PathVariable String tenantId) {
        return tenantService.findById(tenantId);
    }

    @PatchMapping("/platform/tenants/{tenantId}")
    public TenantService.TenantView updateTenant(
            @PathVariable String tenantId,
            @Valid @RequestBody TenantDetailsRequest request,
            @AuthenticationPrincipal CampusPilotPrincipal actor) {
        return tenantService.update(tenantId, request.toDetails(), actor.id());
    }

    @PostMapping("/platform/tenants/{tenantId}/admin-invitations")
    @ResponseStatus(HttpStatus.CREATED)
    public InvitationService.InvitationCreated inviteAdministrator(
            @PathVariable String tenantId,
            @Valid @RequestBody AdminInvitationRequest request,
            @AuthenticationPrincipal CampusPilotPrincipal actor) {
        return invitationService.createTenantInvitation(tenantId, request.email(), actor.id());
    }

    @PostMapping("/platform/tenants/{tenantId}/activate")
    public TenantService.TenantView activateTenant(
            @PathVariable String tenantId,
            @AuthenticationPrincipal CampusPilotPrincipal actor) {
        return tenantService.activate(tenantId, actor.id());
    }

    @GetMapping("/college/setup-status")
    public TenantService.SetupStatus setupStatus(
            @AuthenticationPrincipal CampusPilotPrincipal user, HttpServletRequest request) {
        var session = request.getSession(false);
        String tenantId = session == null ? null : (String) session.getAttribute("CAMPUSPILOT_ACTIVE_TENANT");
        return tenantService.setupStatus(user.id(), tenantId);
    }

    public record TenantDetailsRequest(
            @NotBlank @Size(max = 160) String name,
            @NotBlank @Size(max = 80) @Pattern(regexp = "[a-z0-9]+(?:-[a-z0-9]+)*") String slug,
            @NotBlank @Pattern(regexp = "ENGINEERING|ARTS_SCIENCE|BED_MED|MANAGEMENT_STUDIES") String collegeType,
            @Size(max = 100) String registrationNumber,
            @NotBlank @Email @Size(max = 254) String contactEmail,
            @Size(max = 40) String phone,
            @Size(max = 500) String address) {
        TenantService.TenantDetails toDetails() {
            return new TenantService.TenantDetails(
                    name, slug, collegeType, registrationNumber, contactEmail, phone, address);
        }
    }

    public record AdminInvitationRequest(@NotBlank @Email @Size(max = 254) String email) {}
}
