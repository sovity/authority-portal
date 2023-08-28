package de.sovity.authorityportal.web.services.auth

import de.sovity.authorityportal.web.services.utils.unauthorized
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.ws.rs.core.HttpHeaders
import jakarta.ws.rs.core.SecurityContext
import org.eclipse.microprofile.config.inject.ConfigProperty
import java.util.Base64
import java.util.Optional

@ApplicationScoped
class DevLoggedInUserFactory {

    @Inject
    lateinit var context: SecurityContext

    @Inject
    lateinit var headers: HttpHeaders

    @ConfigProperty(name = "quarkus.security.users.embedded.orgIds")
    lateinit var devOrgIds: Optional<Map<String, String>>

    @ConfigProperty(name = "quarkus.security.users.embedded.roles")
    lateinit var devRoles: Optional<Map<String, String>>

    fun buildDevLoggedInUser(): LoggedInUser {
        val userId = getUserFromBasicAuthHeader() ?: unauthorized()

        val organisationId = devOrgIds.orElseThrow {
            error("Properties for the local dev dummy user must be set in application.properties")
        }[userId]

        val roles = (devRoles.orElseThrow {
            error("Properties for the local dev dummy user must be set in application.properties")
        }[userId]?:"")
            .split(",")
            .map { it.trim() }
            .filter { it.isNotBlank() }
            .toSet()

        return LoggedInUser(userId, organisationId, roles)
    }

    private fun getUserFromBasicAuthHeader(): String? {
        val authHeader = headers.getRequestHeader(HttpHeaders.AUTHORIZATION)
        val base64credentials = authHeader?.firstOrNull()?.substring("Basic ".length)?.trim()

        return String(Base64.getDecoder().decode(base64credentials)).split(":").firstOrNull()
    }
}
