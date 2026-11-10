package com.campuspilot.identity;

import java.nio.charset.StandardCharsets;
import java.util.Map;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;
import org.springframework.http.HttpStatus;
import com.campuspilot.exception.ApiException;

@Service
public class EmailDeliveryService {
    private final ObjectProvider<JavaMailSender> senderProvider;
    private final String senderAddress;
    private final String mailHost;
    private final String publicUrl;

    public EmailDeliveryService(
            ObjectProvider<JavaMailSender> senderProvider,
            @Value("${app.mail.from}") String senderAddress,
            @Value("${app.mail.host}") String mailHost,
            @Value("${app.public-url}") String publicUrl) {
        this.senderProvider = senderProvider;
        this.senderAddress = senderAddress;
        this.mailHost = mailHost;
        this.publicUrl = publicUrl.replaceAll("/+$", "");
    }

    public boolean isConfigured() {
        return !mailHost.isBlank() && !senderAddress.isBlank() && senderProvider.getIfAvailable() != null;
    }

    public void requireConfigured() {
        if (!isConfigured()) {
            throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "EMAIL_NOT_CONFIGURED",
                    "Email delivery is not configured. Set MAIL_HOST and MAIL_FROM.");
        }
    }

    public void sendInvitation(String recipient, String token) {
        String link = publicUrl + "/invitation/accept?token=" + token;
        sendTemplate(recipient, "Your CampusPilot administrator invitation",
                "email/tenant-admin-invitation.txt", "email/tenant-admin-invitation.html",
                Map.of("{{invitationUrl}}", link));
    }

    public void sendPlatformInvitation(String recipient, String token) {
        String link = publicUrl + "/invitation/accept?token=" + token;
        sendTemplate(recipient, "Your CampusPilot platform administrator invitation",
                "email/platform-admin-invitation.txt", "email/platform-admin-invitation.html",
                Map.of("{{invitationUrl}}", link));
    }

    public void sendPasswordReset(String recipient, String code) {
        sendTemplate(recipient, "Your CampusPilot password reset code",
                "email/password-reset.txt", "email/password-reset.html",
                Map.of("{{code}}", code));
    }

    private void sendTemplate(
            String recipient, String subject, String textTemplate, String htmlTemplate, Map<String, String> values) {
        requireConfigured();
        try {
            var message = senderProvider.getObject().createMimeMessage();
            var helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());
            helper.setFrom(senderAddress);
            helper.setTo(recipient);
            helper.setSubject(subject);
            helper.setText(render(textTemplate, values), render(htmlTemplate, values));
            senderProvider.getObject().send(message);
        } catch (Exception exception) {
            throw new EmailDeliveryException("Email could not be delivered.", exception);
        }
    }

    private static String render(String templatePath, Map<String, String> values) throws java.io.IOException {
        var resource = new ClassPathResource("templates/" + templatePath);
        String content = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
        for (var entry : values.entrySet()) {
            content = content.replace(entry.getKey(), escapeHtml(entry.getValue()));
        }
        return content;
    }

    private static String escapeHtml(String value) {
        return value.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }

    public static class EmailDeliveryException extends RuntimeException {
        public EmailDeliveryException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
