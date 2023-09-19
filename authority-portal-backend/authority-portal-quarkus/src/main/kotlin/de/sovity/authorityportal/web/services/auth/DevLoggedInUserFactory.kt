package de.sovity.authorityportal.web.services.auth

import de.sovity.authorityportal.web.services.db.UserService
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

    @Inject
    lateinit var userService: UserService

    @ConfigProperty(name = "quarkus.security.users.embedded.users")
    lateinit var devUserCredentials: Optional<Map<String, String>>

    @ConfigProperty(name = "quarkus.security.users.embedded.roles")
    lateinit var devRoles: Optional<Map<String, String>>

    fun buildDevLoggedInUser(): LoggedInUser {
        val userId = getUserId()
        val roles = getRoles(userId)
        val organizationMdsId: String? = userService.getUserOrCreate(userId).organizationMdsId

        return LoggedInUser(userId, organizationMdsId, roles)
    }


    private fun getUserFromBasicAuthHeader(): String? {
        val authHeader = headers.getRequestHeader(HttpHeaders.AUTHORIZATION)
        val base64credentials = authHeader?.firstOrNull()?.substring("Basic ".length)?.trim()
        val credentials = String(Base64.getDecoder().decode(base64credentials)).split(":")

        val userId = credentials.firstOrNull()
        val password = credentials.lastOrNull()
        val devPassword = devUserCredentials.orElseThrow {
            error("Properties for the local dev dummy user must be set in application.properties")
        }[userId]

        if (password != devPassword) {
            unauthorized()
        }

        return userId
    }

    private fun getUserId() = getUserFromBasicAuthHeader() ?: unauthorized()

    private fun getRoles(userId: String) = (devRoles.orElseThrow {
        error("Properties for the local dev dummy user must be set in application.properties")
    }[userId] ?: "")
        .split(",")
        .map { it.trim() }
        .filter { it.isNotBlank() }
        .toSet()
}
