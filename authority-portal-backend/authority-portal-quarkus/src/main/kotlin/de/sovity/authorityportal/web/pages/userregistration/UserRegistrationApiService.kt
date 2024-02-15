package de.sovity.authorityportal.web.pages.userregistration

import de.sovity.authorityportal.api.model.UserRegistrationStatusResult
import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.services.UserService
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import io.quarkus.logging.Log
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class UserRegistrationApiService {

    @Inject
    lateinit var keycloakService: KeycloakService

    @Inject
    lateinit var organizationService: OrganizationService

    @Inject
    lateinit var userService: UserService

    fun userRegistrationStatus(userId: String): UserRegistrationStatusResult {
        val user = userService.getUserOrThrow(userId)
        val status = user.registrationStatus.toDto()

        Log.info("User registration status requested. registrationStatus=$status, userId=$userId.")

        return UserRegistrationStatusResult(user.registrationStatus.toDto())
    }

}
