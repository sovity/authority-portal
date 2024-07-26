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

package de.sovity.authorityportal.web.pages.usermanagement

import de.sovity.authorityportal.api.model.UserAuthenticationStatusDto
import de.sovity.authorityportal.api.model.UserDetailDto
import de.sovity.authorityportal.api.model.UserInfo
import de.sovity.authorityportal.api.model.UserRoleDto
import de.sovity.authorityportal.web.auth.LoggedInUser
import de.sovity.authorityportal.web.pages.userregistration.toDto
import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.services.UserDetailService
import jakarta.enterprise.context.ApplicationScoped

@ApplicationScoped
class UserInfoApiService(
    val userDetailService: UserDetailService,
    val organizationService: OrganizationService,
    val userRoleMapper: UserRoleMapper
) {

    fun userInfo(loggedInUser: LoggedInUser): UserInfo = when {
        loggedInUser.authenticated -> authenticatedUserInfo(loggedInUser)
        else -> unauthenticatedUserInfo()
    }

    private fun authenticatedUserInfo(loggedInUser: LoggedInUser): UserInfo {
        val organizationId = loggedInUser.organizationId
        val userId = loggedInUser.userId

        val user = userDetailService.getUserData(userId)
        val organizationName = getOrganizationName(organizationId)
        val roles = userRoleMapper.getUserRoles(loggedInUser.roles)

        return UserInfo(
            authenticationStatus = UserAuthenticationStatusDto.AUTHENTICATED,
            userId = userId,
            firstName = user.firstName,
            lastName = user.lastName,
            roles = roles.toList(),
            registrationStatus = user.registrationStatus.toDto(),
            organizationId = organizationId ?: "",
            organizationName = organizationName ?: "",
        )
    }

    private fun unauthenticatedUserInfo(): UserInfo {
        return UserInfo(
            authenticationStatus = UserAuthenticationStatusDto.UNAUTHENTICATED,
            userId = "unauthenticated",
            firstName = "Unknown",
            lastName = "User",
            roles = listOf(UserRoleDto.UNAUTHENTICATED),
            registrationStatus = null,
            organizationId = "unauthenticated",
            organizationName = "No Organization"
        )
    }

    /**
     * Retrieves user details for the specified user ID.
     *
     * @param userId The ID of the user for whom to retrieve details.
     * @return [UserDetailDto] object containing the user's details.
     * @see userDetailService.getUserData
     * @see userRoleMapper.getUserRoles
     * @see UserDetailDto
     */
    fun userDetails(userId: String): UserDetailDto {
        val user = userDetailService.getUserData(userId)
        val invitingUser = user.invitedBy?.let { userDetailService.getUserData(it) }
        val roleDtos = userRoleMapper.getUserRoles(user.roles)

        return UserDetailDto(
            userId = user.userId,
            email = user.email,
            firstName = user.firstName,
            lastName = user.lastName,
            phone = user.phoneNumber ?: "",
            position = user.position ?: "",

            onboardingType = user.onboardingType.toDto(),
            creationDate = user.createdAt,
            registrationStatus = user.registrationStatus.toDto(),
            roles = roleDtos.toList(),

            organizationId = user.organizationId ?: "",
            organizationName = getOrganizationName(user.organizationId) ?: "",

            invitingUserId = invitingUser?.userId,
            invitingUserFirstName = invitingUser?.firstName,
            invitingUserLastName = invitingUser?.lastName
        )
    }

    private fun getOrganizationName(organizationId: String?): String? {
        if (organizationId.isNullOrEmpty()) {
            return null
        }
        val organization = organizationService.getOrganizationOrThrow(organizationId)
        return organization.name
    }
}
