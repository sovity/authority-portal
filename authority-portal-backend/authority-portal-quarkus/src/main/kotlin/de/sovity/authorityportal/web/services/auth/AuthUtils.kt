package de.sovity.authorityportal.web.services.auth

import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.web.services.db.UserService
import de.sovity.authorityportal.web.services.utils.unauthorized
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class AuthUtils {
    @Inject
    lateinit var loggedInUser: LoggedInUser

    @Inject
    lateinit var userService: UserService

    fun requiresAuthenticated() {
        if (loggedInUser.userId.isBlank()) {
            unauthorized()
        }
    }

    fun requiresRole(role: String) {
        if (!loggedInUser.roles.contains(role)) {
            unauthorized()
        }
    }

    fun requiresAnyRole(vararg roles: String) {
        if (!loggedInUser.roles.any { it in roles }) {
            unauthorized()
        }
    }

    fun requiresRegistrationStatus(status: UserRegistrationStatus) {
        val userRegistrationStatus = userService.getUserOrThrow(loggedInUser.userId).registrationStatus

        if (userRegistrationStatus != status) {
            unauthorized("User registration status is invalid. Expected: $status. Has: $userRegistrationStatus")
        }
    }

    fun requiresMemberOfOrganization() {
        if (loggedInUser.organizationMdsId.isNullOrEmpty()) {
            unauthorized("User is not associated with any organization")
        }
    }
}
