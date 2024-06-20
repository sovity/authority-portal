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

import de.sovity.authorityportal.api.model.IdResponse
import de.sovity.authorityportal.api.model.OnboardingUserUpdateDto
import de.sovity.authorityportal.api.model.UpdateUserDto
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.web.services.UserService
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import de.sovity.authorityportal.web.utils.TimeUtils
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class UserUpdateApiService(
    val userService: UserService,
    val keycloakService: KeycloakService,
    val timeUtils: TimeUtils
) {

    fun updateUserDetails(userId: String, updateUserDto: UpdateUserDto): IdResponse {
        val user = userService.getUserOrThrow(userId)
        user.firstName = updateUserDto.firstName.trim()
        user.lastName = updateUserDto.lastName.trim()
        user.phone = updateUserDto.phone.trim()
        user.jobTitle = updateUserDto.jobTitle.trim()
        user.email = updateUserDto.email.trim()
        user.update()
        keycloakService.updateUser(userId, updateUserDto.firstName, updateUserDto.lastName, updateUserDto.email)
        return IdResponse(userId, timeUtils.now())
    }

    fun updateOnboardingUserDetails(userId: String, onboardingUserUpdateDto: OnboardingUserUpdateDto): IdResponse {
        val user = userService.getUserOrThrow(userId)
        user.firstName = onboardingUserUpdateDto.firstName.trim()
        user.lastName = onboardingUserUpdateDto.lastName.trim()
        user.phone = onboardingUserUpdateDto.phoneNumber.trim()
        user.jobTitle = onboardingUserUpdateDto.jobTitle.trim()
        user.registrationStatus = UserRegistrationStatus.ACTIVE
        user.update()
        keycloakService.updateUser(
            userId = userId,
            firstName = onboardingUserUpdateDto.firstName,
            lastName = onboardingUserUpdateDto.lastName,
            email = user.email
        )
        return IdResponse(userId, timeUtils.now())
    }
}
