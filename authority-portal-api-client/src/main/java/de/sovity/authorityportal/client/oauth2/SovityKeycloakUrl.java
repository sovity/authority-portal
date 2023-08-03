package de.sovity.authorityportal.client.oauth2;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

/**
 * Quick access to the Keycloak OAuth Token URLs for our staging and production environments.
 * <p>
 * For ease of use of our API Wrapper Client Libraries in Use Case Applications.
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class SovityKeycloakUrl {

    /**
     * Sovity Production Keycloak OAuth2 Token URL
     */
    public static final String PRODUCTION = "https://keycloak.prod-sovity.azure.sovity.io/realms/Portal/protocol/openid-connect/token";

    /**
     * Sovity Staging Keycloak OAuth2 Token URL
     */
    public static final String STAGING = "https://keycloak.stage-sovity.azure.sovity.io/realms/Portal/protocol/openid-connect/token";
}
