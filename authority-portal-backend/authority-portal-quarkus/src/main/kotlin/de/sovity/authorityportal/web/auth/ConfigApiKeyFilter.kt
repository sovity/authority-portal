package de.sovity.authorityportal.web.auth

import de.sovity.authorityportal.web.utils.unauthorized
import io.quarkus.logging.Log
import jakarta.ws.rs.container.ContainerRequestContext
import org.eclipse.microprofile.config.inject.ConfigProperty
import org.jboss.resteasy.reactive.server.ServerRequestFilter

class ConfigApiKeyFilter {

    @ConfigProperty(name = "authority-portal.config.api-key")
    lateinit var apiKey: String

    @ServerRequestFilter(preMatching = true)
    fun filterApiKey(containerRequestContext: ContainerRequestContext) {
        val requestUri = containerRequestContext.uriInfo.requestUri.path

        if (requestUri.startsWith("/api/config")) {
            val apiKeyHeader = containerRequestContext.getHeaderString("x-api-key")

            if (apiKey != apiKeyHeader) {
                Log.info("Invalid API key. actual=$apiKeyHeader, expected=$apiKey")
                unauthorized("Invalid API key")
            }
        }
    }
}
