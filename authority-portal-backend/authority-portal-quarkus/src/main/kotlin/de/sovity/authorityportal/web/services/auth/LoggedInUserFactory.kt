package de.sovity.authorityportal.web.services.auth

import de.sovity.authorityportal.web.services.db.UserService
import de.sovity.authorityportal.web.services.utils.unauthorized
import jakarta.enterprise.context.ApplicationScoped
import jakarta.enterprise.context.RequestScoped
import jakarta.enterprise.inject.Instance
import jakarta.enterprise.inject.Produces
import jakarta.inject.Inject
import jakarta.json.JsonObject
import jakarta.json.JsonString
import jakarta.ws.rs.core.SecurityContext
import org.eclipse.microprofile.jwt.JsonWebToken

@ApplicationScoped
class LoggedInUserFactory {

    @Inject
    lateinit var jwtInstance: Instance<JsonWebToken>

    @Inject
    lateinit var context: SecurityContext

    @Inject
    lateinit var userService: UserService

    @Inject
    lateinit var devLoggedInUserFactory: DevLoggedInUserFactory

    @Produces
    @RequestScoped
    fun getLoggedInUser(): LoggedInUser {
        if (context.authenticationScheme == "Basic") {
            return devLoggedInUserFactory.buildDevLoggedInUser()
        }

        return buildLoggedInUser(jsonWebToken())
    }

    private fun buildLoggedInUser(jwt: JsonWebToken): LoggedInUser {
        val userId = getUserId(jwt)
        val roles = getRoles(jwt)
        val organizationMdsId: String? = userService.getUserOrCreate(userId).organizationMdsId

        return LoggedInUser(userId, organizationMdsId, roles)
    }

    private fun getUserId(jwt: JsonWebToken): String =
        jwt.claim<String>("sub").orElseGet { unauthorized() }

    private fun getRoles(jwt: JsonWebToken) = jwt.claim<JsonObject>("realm_access")
        .orElseGet { unauthorized() }
        .getJsonArray("roles")
        .filterIsInstance<JsonString>()
        .filter { it.string.startsWith("UR_") || it.string.startsWith("AR_") }
        .map { it.string }
        .toSet()

    private fun jsonWebToken() = jwtInstance.toList().firstOrNull() ?: unauthorized()
}
