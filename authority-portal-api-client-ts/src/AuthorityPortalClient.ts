import {Configuration, ConfigurationParameters, UiApi} from './generated';

/**
 * API Client for our sovity Authority Portal Client
 */
export interface AuthorityPortalClient {
    uiApi: UiApi;
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
    };
}

/**
 * Options for instantiating an EDC API Client
 */
export interface AuthorityPortalClientOptions {
    backendUrl: string;
    configOverrides?: Partial<ConfigurationParameters>;
}
