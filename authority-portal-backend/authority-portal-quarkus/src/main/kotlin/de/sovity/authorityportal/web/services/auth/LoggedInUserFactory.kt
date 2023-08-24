package de.sovity.authorityportal.web.services.auth

import de.sovity.authorityportal.web.services.utils.unauthorized
import jakarta.enterprise.context.ApplicationScoped
import jakarta.enterprise.context.RequestScoped
import jakarta.enterprise.inject.Instance
import jakarta.enterprise.inject.Produces
import jakarta.inject.Inject
import jakarta.json.JsonObject
import jakarta.json.JsonString
import org.eclipse.microprofile.jwt.JsonWebToken

@ApplicationScoped
class LoggedInUserFactory {

    @Inject
    lateinit var jwtInstance: Instance<JsonWebToken>

    @Produces
    @RequestScoped
    fun getLoggedInUser(): LoggedInUser {
        return LoggedInUser(getUserId(), getOrganisationId(), getRoles())
    }


    private fun getUserId(): String {
        val jwt = jsonWebToken()
        return jwt.claim<String>("sub").orElseGet{ unauthorized() }
    }

    private fun getOrganisationId(): String? {
        val jwt = jsonWebToken()
        return jwt.claim<String>("organizationId").orElse(null)
    }

    fun getRoles(): Set<String> {
        val jwt = jsonWebToken()
        val claim = jwt.claim<JsonObject>("realm_access").orElseGet{ unauthorized() }

        return claim.getJsonArray("roles")
            .filterIsInstance<JsonString>()
            .filter { it.string.startsWith("UR_") || it.string.startsWith("AR_") }
            .map { it.string }
            .toSet()
    }

    private fun jsonWebToken() = jwtInstance.toList().firstOrNull() ?: unauthorized()
}
