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

    fun getViewDependingOnRole(roles: UserViewRequiredRoles): UserView {
        val userRoles = loggedInUser.roles

        val filter = when {
            userRoles.contains(roles.global) -> UserViewFilter.SEE_ALL
            userRoles.contains(roles.organization) -> UserViewFilter.ONLY_ORGANIZATION
            userRoles.contains(roles.self) -> UserViewFilter.ONLY_SELF
            else -> unauthorized()
        }

        return UserView(filter, loggedInUser.userId, loggedInUser.organisationMdsId)
    }

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

    fun requiresRegistrationStatus(status: UserRegistrationStatus) {
        val userRegistrationStatus = userService.getUserOrThrow(loggedInUser.userId).registrationStatus

        if (userRegistrationStatus != status) {
            unauthorized("User registration status is invalid. Expected: $status. Has: $userRegistrationStatus")
        }
    }
}
