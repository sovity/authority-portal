package de.sovity.authorityportal.web.pages.redirects

import de.sovity.authorityportal.web.environment.DeploymentEnvironmentService
import de.sovity.authorityportal.web.services.ConnectorService
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.ws.rs.core.Response
import java.net.URI
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

@ApplicationScoped
class BrokerRedirectApiService {

    @Inject
    lateinit var deploymentEnvironmentService: DeploymentEnvironmentService

    @Inject
    lateinit var connectorService: ConnectorService

    fun buildCatalogRedirectWithConnectorFilter(mdsId: String, environmentId: String): Response {
        val redirectUrl = buildCatalogUrlWithConnectorFilter(mdsId, environmentId)
        return Response.status(Response.Status.FOUND) // Status code 302
            .location(URI.create(redirectUrl))
            .build()
    }

    private fun buildCatalogUrlWithConnectorFilter(mdsId: String, environmentId: String): String {
        val brokerUrl = deploymentEnvironmentService.findByIdOrThrow(environmentId).broker().url()
        val queryString = connectorService.getConnectorsByMdsId(mdsId, environmentId)
            .map { URLEncoder.encode(it.url, StandardCharsets.UTF_8) }
            .joinToString("&") { "connectorEndpoint=$it" }
        return "$brokerUrl/catalog?$queryString"
    }
}
