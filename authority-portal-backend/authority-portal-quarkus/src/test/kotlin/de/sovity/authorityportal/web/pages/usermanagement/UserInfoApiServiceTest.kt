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

import de.sovity.authorityportal.api.model.UserRegistrationStatusDto
import de.sovity.authorityportal.db.jooq.enums.UserOnboardingType
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.services.UserDetail
import de.sovity.authorityportal.web.services.UserDetailService
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito.`when`
import org.mockito.junit.jupiter.MockitoExtension
import java.time.OffsetDateTime

@ExtendWith(MockitoExtension::class)
class UserInfoApiServiceTest {

    @InjectMocks
    lateinit var userInfoApiService: UserInfoApiService

    @Mock
    lateinit var userDetailService: UserDetailService

    @Mock
    lateinit var userRoleMapper: UserRoleMapper

    @Mock
    lateinit var organizationService: OrganizationService

    @Test
    fun testUserDetails() {
        // arrange
        val userId = "123"
        val userEmail = "john.doe@example.com";
        val user = UserDetail(userId = userId,
            firstName = "Test",
            lastName = "Test",
            email = userEmail,
            position = null,
            phoneNumber = null,
            organizationMdsId = null,
            registrationStatus = UserRegistrationStatus.ACTIVE,
            createdAt = OffsetDateTime.now(),
            roles = setOf("UR_AUTHORITY-PORTAL_AUTHORITY-USER", "UR_AUTHORITY-PORTAL_PARTICIPANT-CURATOR"),
            onboardingType = UserOnboardingType.SELF_REGISTRATION,
            invitedBy = "456"
        )
        `when`(userDetailService.getUserData(userId)).thenReturn(user)

        // act
        val userDetails = userInfoApiService.userDetails(userId)

        // assert
        assertEquals(userEmail, userDetails.email)
        assertEquals(UserRegistrationStatusDto.ACTIVE, userDetails.registrationStatus)
    }
}
