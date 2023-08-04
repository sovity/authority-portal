package de.sovity.authorityportal.client;

import de.sovity.authorityportal.client.gen.api.UiApi;
import lombok.Value;
import lombok.experimental.Accessors;

/**
 * API Client for the sovity Dataspace Authority Portal.
 */
@Value
@Accessors(fluent = true)
public class AuthorityPortalClient {
    UiApi uiApi;

    public static AuthorityPortalClientBuilder builder() {
        return new AuthorityPortalClientBuilder();
    }
}
