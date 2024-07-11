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
import { CatalogApi, Configuration, ConfigurationParameters, UiApi } from './generated';


/**
 * API Client for our sovity Authority Portal Client
 */
export interface AuthorityPortalClient {
    uiApi: UiApi;
    catalogApi: CatalogApi;
}

/**
 * Configure & Build new Authority Portal Client
 * @param opts opts
 */
export function buildAuthorityPortalClient(
    opts: AuthorityPortalClientOptions,
): AuthorityPortalClient {
    const config = new Configuration({
        basePath: opts.backendUrl,
        credentials: 'same-origin',
        ...opts.configOverrides,
    });

    return {
        uiApi: new UiApi(config),
        catalogApi: new CatalogApi(config),
    };
}

/**
 * Options for instantiating an Authority Portal API Client
 */
export interface AuthorityPortalClientOptions {
    backendUrl: string;
    configOverrides?: Partial<ConfigurationParameters>;
}
