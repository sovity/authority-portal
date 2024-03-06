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
