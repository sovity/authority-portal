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
