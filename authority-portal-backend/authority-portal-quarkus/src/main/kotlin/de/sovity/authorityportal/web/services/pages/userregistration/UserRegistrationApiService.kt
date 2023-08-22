package de.sovity.authorityportal.web.services.pages.userregistration

import de.sovity.authorityportal.api.model.UserRegistrationStatusDto
import de.sovity.authorityportal.api.model.UserRegistrationStatusResult
import de.sovity.authorityportal.web.services.thirdparty.keycloak.KeycloakService
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class UserRegistrationApiService {
    @Inject
    lateinit var keycloakService: KeycloakService

    fun userRegistrationStatus(userId: String): UserRegistrationStatusResult {
        val user = keycloakService.getUser(userId)

        return UserRegistrationStatusResult(user.registrationStatus.toDto())
    }

    fun updateUserRegistrationStatus(userId: String, status: UserRegistrationStatusDto): String {
        keycloakService.updateStatus(userId, status.toKc())

        return userId
    }
}
