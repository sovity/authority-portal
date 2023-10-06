package de.sovity.authorityportal.web.pages.userregistration

import de.sovity.authorityportal.api.model.IdResponse
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.web.services.UserService
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import io.quarkus.logging.Log
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class UserDeactivationApiService {

    @Inject
    lateinit var keycloakService: KeycloakService

    @Inject
    lateinit var userService: UserService

    fun deactivateUser(userId: String, adminUserId: String): IdResponse {
        keycloakService.deactivateUser(userId)

        val user = userService.getUserOrThrow(userId)
        user.registrationStatus = UserRegistrationStatus.DEACTIVATED
        user.update()

        keycloakService.forceLogout(userId)

        Log.info("User deactivated. userId=$userId, adminUserId=$adminUserId.")

        return IdResponse(userId)
    }
}
