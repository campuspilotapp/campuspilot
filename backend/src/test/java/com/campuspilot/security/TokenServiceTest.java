package com.campuspilot.security;

import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

class TokenServiceTest {
    private final TokenService tokenService = new TokenService();

    @Test
    void generatedTokensAreRandomAndOnlyTheirHashIsSuitableForPersistence() {
        String first = tokenService.newToken();
        String second = tokenService.newToken();

        assertNotEquals(first, second);
        assertNotEquals(first, tokenService.hash(first));
        assertTrue(tokenService.matches(first, tokenService.hash(first)));
        assertTrue(!tokenService.matches(second, tokenService.hash(first)));
    }
}
