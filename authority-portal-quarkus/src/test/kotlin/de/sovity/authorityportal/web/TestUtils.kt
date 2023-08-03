package de.sovity.authorityportal.web

import de.sovity.authorityportal.client.AuthorityPortalClient
import java.net.URL


fun buildApiClient(backendUrl: URL): AuthorityPortalClient =
        AuthorityPortalClient.builder().backendUrl(backendUrl.toString()).build();