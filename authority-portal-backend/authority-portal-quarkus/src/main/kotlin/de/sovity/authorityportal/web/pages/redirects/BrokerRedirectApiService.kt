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
        val queryString = connectorService.getConnectorsByMdsIdAndEnvironment(mdsId, environmentId)
            .map { URLEncoder.encode(it.endpointUrl, StandardCharsets.UTF_8) }
            .joinToString("&") { "connectorEndpoint=$it" }
        return "$brokerUrl?$queryString"
    }

    fun getCatalogRedirect(environmentId: String): Response {
        val redirectUrl = deploymentEnvironmentService.findByIdOrThrow(environmentId).broker().url()
        return Response.status(Response.Status.FOUND) // Status code 302
            .location(URI.create(redirectUrl))
            .build()
    }
}
