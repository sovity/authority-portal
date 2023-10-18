package de.sovity.authorityportal.web.auth

import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.web.services.UserService
import de.sovity.authorityportal.web.utils.unauthorized
import io.quarkus.logging.Log
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class AuthUtils {
    @Inject
    lateinit var loggedInUser: LoggedInUser

    @Inject
    lateinit var userService: UserService

    fun requiresAuthenticated() {
        val userId = loggedInUser.userId

        if (userId.isBlank()) {
            Log.error("User is not authenticated. userId=$userId.")
            unauthorized()
        }
    }

    fun requiresRole(role: String) {
        val userRoles = loggedInUser.roles

        if (!userRoles.contains(role)) {
            Log.error("User is not authorized. userRoles=$userRoles, requiredRole=$role, userId=${loggedInUser.userId}.")
            unauthorized()
        }
    }

    fun requiresAnyRole(vararg roles: String) {
        val userRoles = loggedInUser.roles

        if (!userRoles.any { it in roles }) {
            Log.error("User is not authorized. userRoles=$userRoles, requiredRoles=${roles.toSet()}, userId=${loggedInUser.userId}.")
            unauthorized()
        }
    }

    fun requiresRegistrationStatus(status: UserRegistrationStatus) {
        val userRegistrationStatus = userService.getUserOrThrow(loggedInUser.userId).registrationStatus

        if (userRegistrationStatus != status) {
            Log.error("User registration status is invalid. userRegistrationStatus: $userRegistrationStatus, expectedRegistrationStatus: $status, userId=${loggedInUser.userId}.")
            unauthorized("User registration status is invalid. Expected: $status. Has: $userRegistrationStatus")
        }
    }

    fun requiresAnyRegistrationStatus(vararg statuses: UserRegistrationStatus) {
        val userRegistrationStatus = userService.getUserOrThrow(loggedInUser.userId).registrationStatus

        if (!statuses.contains(userRegistrationStatus)) {
            Log.error("User registration status is invalid. userRegistrationStatus: $userRegistrationStatus, expectedRegistrationStatuses: ${statuses.toSet()}, userId=${loggedInUser.userId}.")
            unauthorized("User registration status is invalid. Expected one of: ${statuses.toSet()}. Has: $userRegistrationStatus")
        }
    }

    fun requiresMemberOfAnyOrganization() {
        if (loggedInUser.organizationMdsId.isNullOrEmpty()) {
            Log.error("User is not associated with any organization. userId=${loggedInUser.userId}.")
            unauthorized("User is not associated with any organization")
        }
    }

    fun requiresMemberOfSameOrganizationAs(userId: String) {
        requiresMemberOfAnyOrganization()

        val user = userService.getUserOrThrow(userId)
        if (user.organizationMdsId != loggedInUser.organizationMdsId) {
            Log.error("User is not part of logged in/executing user's organization. userId=$userId, loggedInUserMdsId=${loggedInUser.organizationMdsId}, loggedInUserId=${loggedInUser.userId}.")
            unauthorized("User is not part of logged in/executing user's organization")
        }
    }

    fun requiresTargetNotSelf(userId: String) {
        if (userId == loggedInUser.userId) {
            Log.error("User is not allowed to perform requested action on self. userId=$userId, loggedInUserId=${loggedInUser.userId}.")
            unauthorized("User is not allowed to perform requested action on self")
        }
    }

    fun requires(authorized: Boolean, userId: String) {
        if (!authorized) {
            Log.error("User is not authorized. userId=$userId, loggedInUserMdsId=${loggedInUser.organizationMdsId}, " +
                "loggedInUserId=${loggedInUser.userId}.")
            unauthorized()
        }
    }

    fun hasRole(role: String): Boolean {
        return loggedInUser.roles.contains(role);
    }

    fun isMemberOfSameOrganizationAs(userId: String): Boolean {
        if (loggedInUser.organizationMdsId.isNullOrEmpty()) {
            return false;
        }

        val user = userService.getUserOrThrow(userId)
        return user.organizationMdsId == loggedInUser.organizationMdsId;
    }
}
