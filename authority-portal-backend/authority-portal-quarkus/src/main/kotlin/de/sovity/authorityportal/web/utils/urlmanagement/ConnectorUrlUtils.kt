package de.sovity.authorityportal.web.utils.urlmanagement

import jakarta.enterprise.context.ApplicationScoped
import org.eclipse.microprofile.config.inject.ConfigProperty

@ApplicationScoped
class ConnectorUrlUtils {

    @ConfigProperty(name = "authority-portal.connectors.url.frontend")
    lateinit var frontendUrl: String

    @ConfigProperty(name = "authority-portal.connectors.url.management")
    lateinit var managementUrl: String

    @ConfigProperty(name = "authority-portal.connectors.url.endpoint")
    lateinit var endpointUrl: String

    fun getConnectorFrontendUrl(baseUrl: String): String {
        return baseUrl + frontendUrl
    }

    fun getConnectorManagementUrl(baseUrl: String): String {
        return baseUrl + managementUrl
    }

    fun getConnectorEndpoint(baseUrl: String): String {
        return baseUrl + endpointUrl
    }

    fun getConnectorEndpoints(baseUrls: Collection<String>): List<String> {
        return baseUrls.map { getConnectorEndpoint(it) }
    }
}
