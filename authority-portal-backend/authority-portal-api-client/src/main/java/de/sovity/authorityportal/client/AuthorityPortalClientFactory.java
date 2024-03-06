/*
 * Copyright (c) 2024 sovity GmbH
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Contributors:
 *      sovity GmbH - initial implementation
 */
package de.sovity.authorityportal.client;

import de.sovity.authorityportal.client.gen.ApiClient;
import de.sovity.authorityportal.client.gen.api.UiApi;
import de.sovity.authorityportal.client.oauth2.OAuth2CredentialsAuthenticator;
import de.sovity.authorityportal.client.oauth2.OAuth2CredentialsInterceptor;
import de.sovity.authorityportal.client.oauth2.OAuth2CredentialsStore;
import de.sovity.authorityportal.client.oauth2.OAuth2TokenFetcher;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

/**
 * Builds {@link AuthorityPortalClient}s.
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class AuthorityPortalClientFactory {

    public static AuthorityPortalClient newClient(AuthorityPortalClientBuilder builder) {
        var apiClient = new ApiClient()
                .setServerIndex(null)
                .setBasePath(builder.backendUrl());

        if (builder.oauth2ClientCredentials() != null) {
            var tokenFetcher = new OAuth2TokenFetcher(builder.oauth2ClientCredentials());
            var handler = new OAuth2CredentialsStore(tokenFetcher);
            var httpClient = apiClient.getHttpClient()
                    .newBuilder()
                    .addInterceptor(new OAuth2CredentialsInterceptor(handler))
                    .authenticator(new OAuth2CredentialsAuthenticator(handler))
                    .build();
            apiClient.setHttpClient(httpClient);
        }

        return new AuthorityPortalClient(
                new UiApi(apiClient)
        );
    }
}
