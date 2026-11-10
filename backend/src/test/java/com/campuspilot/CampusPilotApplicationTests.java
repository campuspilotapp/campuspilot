package com.campuspilot;

import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

class CampusPilotApplicationTests {
    @Test
    void passwordsAreStoredAsOneWayHashes() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(4);
        String password = "campuspilot-secure-password";
        String encoded = encoder.encode(password);

        assertNotEquals(password, encoded);
        assertTrue(encoder.matches(password, encoded));
    }
}
