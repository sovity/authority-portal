package de.sovity.authorityportal.client;

import de.sovity.authorityportal.client.oauth2.OAuth2ClientCredentials;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
@Accessors(fluent = true, chain = true)
public class AuthorityPortalClientBuilder {
    /**
     * Authority Portal Backend URL, e.g. https://my-portal.sovity.io
     */
    private String backendUrl;

    /**
     * Optional, enables OAuth2 "Client Credentials Flow" authentication.
     */
    private OAuth2ClientCredentials oauth2ClientCredentials;

    public AuthorityPortalClient build() {
        return AuthorityPortalClientFactory.newClient(this);
    }
}
