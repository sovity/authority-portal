package de.sovity.authorityportal.client.oauth2;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;

/**
 * Credentials for connecting to the Authority Portal via the OAuth2 "Client Credentials" flow.
 */
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class OAuth2ClientCredentials {
    @NonNull
    private String tokenUrl;
    @NonNull
    private String clientId;
    @NonNull
    private String clientSecret;
}
