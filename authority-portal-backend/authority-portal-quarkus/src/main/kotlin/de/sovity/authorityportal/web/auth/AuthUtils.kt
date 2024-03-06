/*
 * Copyright (c) 2024 sovity GmbH
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Contributors:
 *      sovity GmbH - initial implementation
 */
package de.sovity.authorityportal.web.auth

import de.sovity.authorityportal.db.jooq.enums.OrganizationRegistrationStatus
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.web.services.OrganizationService
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

    @Inject
    lateinit var organizationService: OrganizationService

    fun requiresAuthenticated() {
        if (!loggedInUser.authenticated) {
            Log.error("User is not authenticated.")
            unauthorized()
        }
    }

    fun requiresUnauthenticated() {
        if (loggedInUser.authenticated) {
            Log.error("User is authenticated, this route requires being unauthenticated, though.")
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
        requiresAuthenticated()
        val userRegistrationStatus = userService.getUserOrThrow(loggedInUser.userId).registrationStatus

        if (userRegistrationStatus != status) {
            Log.error("User registration status is invalid. userRegistrationStatus: $userRegistrationStatus, expectedRegistrationStatus: $status, userId=${loggedInUser.userId}.")
            unauthorized("User registration status is invalid. Expected: $status. Has: $userRegistrationStatus")
        }
    }

    fun requiresMemberOfAnyOrganization() {
        requiresAuthenticated()
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
        requiresAuthenticated()
        if (userId == loggedInUser.userId) {
            Log.error("User is not allowed to perform requested action on self. userId=$userId, loggedInUserId=${loggedInUser.userId}.")
            unauthorized("User is not allowed to perform requested action on self")
        }
    }

    fun requires(authorized: Boolean, userId: String) {
        if (!authorized) {
            Log.error("User is not authorized. userId=$userId, loggedInUserMdsId=${loggedInUser.organizationMdsId}, loggedInUserId=${loggedInUser.userId}.")
            unauthorized()
        }
    }

    fun requiresSelfOrRole(userId: String, role: String) {
        requiresAuthenticated()
        if (userId != loggedInUser.userId && !loggedInUser.roles.contains(role)) {
            Log.error("User can only perform the requested action on themself or needs the desired role. userRoles=${loggedInUser.roles}, requiredRole=$role, userId=$userId, loggedInUserId=${loggedInUser.userId}.")
            unauthorized("User can only perform the requested action on themself or needs the desired role")
        }
    }

    fun hasRole(role: String): Boolean {
        return loggedInUser.roles.contains(role);
    }

    fun isMemberOfSameOrganizationAs(userId: String): Boolean {
        requiresAuthenticated()
        if (loggedInUser.organizationMdsId.isNullOrEmpty()) {
            return false;
        }

        val user = userService.getUserOrThrow(userId)
        return user.organizationMdsId == loggedInUser.organizationMdsId;
    }

    fun requiresOrganizationRegistrationStatus(status: OrganizationRegistrationStatus) {
        requiresAuthenticated()
        requiresMemberOfAnyOrganization()

        val organization = organizationService.getOrganizationOrThrow(loggedInUser.organizationMdsId!!)
        if (organization.registrationStatus != status) {
            Log.error("User can only perform the action if their organization is in the onboarding phase. userId=${loggedInUser.userId}, mdsId=${organization.mdsId}")
            unauthorized("User can only perform the action if their organization is in the onboarding phase")
        }
    }
}
