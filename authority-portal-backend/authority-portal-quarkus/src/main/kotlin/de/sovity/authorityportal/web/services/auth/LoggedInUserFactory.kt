package de.sovity.authorityportal.web.services.auth

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
        val userId = jwt.claim<String>("sub").orElseGet { unauthorized() }
        val organisationId = jwt.claim<String>("organizationId").orElse(null)

        val roles = jwt.claim<JsonObject>("realm_access")
            .orElseGet { unauthorized() }
            .getJsonArray("roles")
            .filterIsInstance<JsonString>()
            .filter { it.string.startsWith("UR_") || it.string.startsWith("AR_") }
            .map { it.string }
            .toSet()

        return LoggedInUser(userId, organisationId, roles)
    }

    private fun jsonWebToken() = jwtInstance.toList().firstOrNull() ?: unauthorized()
}
