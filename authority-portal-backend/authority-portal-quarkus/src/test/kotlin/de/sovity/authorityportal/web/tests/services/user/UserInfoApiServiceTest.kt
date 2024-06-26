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

package de.sovity.authorityportal.web.tests.services.user

import de.sovity.authorityportal.api.UiResource
import de.sovity.authorityportal.api.model.UserAuthenticationStatusDto
import de.sovity.authorityportal.api.model.UserDetailDto
import de.sovity.authorityportal.api.model.UserInfo
import de.sovity.authorityportal.api.model.UserOnboardingTypeDto
import de.sovity.authorityportal.api.model.UserRegistrationStatusDto
import de.sovity.authorityportal.api.model.UserRoleDto
import de.sovity.authorityportal.db.jooq.enums.UserOnboardingType
import de.sovity.authorityportal.seeds.utils.ScenarioData
import de.sovity.authorityportal.seeds.utils.ScenarioInstaller
import de.sovity.authorityportal.seeds.utils.dummyDate
import de.sovity.authorityportal.seeds.utils.dummyDevMdsId
import de.sovity.authorityportal.seeds.utils.dummyDevUserUuid
import de.sovity.authorityportal.web.Roles
import de.sovity.authorityportal.web.tests.useDevUser
import de.sovity.authorityportal.web.tests.useUnauthenticated
import de.sovity.authorityportal.web.tests.withOffsetDateTimeComparator
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import io.quarkus.test.InjectMock
import io.quarkus.test.TestTransaction
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.whenever

@QuarkusTest
@ExtendWith(MockitoExtension::class)
class UserInfoApiServiceTest {

    @Inject
    lateinit var uiResource: UiResource

    @Inject
    lateinit var scenarioInstaller: ScenarioInstaller

    @InjectMock
    lateinit var keycloakService: KeycloakService

    @Test
    fun `user-info also handles unauthenticated requests`() {
        // arrange
        useUnauthenticated()

        // act
        val result = uiResource.userInfo()

        // assert
        val expected = UserInfo(
            authenticationStatus = UserAuthenticationStatusDto.UNAUTHENTICATED,
            userId = "unauthenticated",
            firstName = "Unknown",
            lastName = "User",
            roles = listOf(UserRoleDto.UNAUTHENTICATED),
            registrationStatus = null,
            organizationMdsId = "unauthenticated",
            organizationName = "No Organization"
        )

        assertThat(result)
            .usingRecursiveComparison()
            .withStrictTypeChecking()
            .isEqualTo(expected)
    }

    @Test
    @TestTransaction
    fun `user-info for authenticated user`() {
        // arrange
        useDevUser(1, 1, setOf(Roles.UserRoles.PARTICIPANT_USER))
        whenever(keycloakService.getUserRoles(dummyDevUserUuid(1))).thenReturn(setOf(Roles.UserRoles.PARTICIPANT_USER))

        ScenarioData().apply {
            user(1, 1) {
                it.firstName = "Max"
                it.lastName = "Mustermann"
            }
            organization(1, 1) {
                it.name = "Max's Organization"
            }
            scenarioInstaller.install(this)
        }

        // act
        val result = uiResource.userInfo()

        // assert
        val expected = UserInfo(
            authenticationStatus = UserAuthenticationStatusDto.AUTHENTICATED,
            userId = dummyDevUserUuid(1),
            firstName = "Max",
            lastName = "Mustermann",
            roles = listOf(UserRoleDto.USER),
            registrationStatus = UserRegistrationStatusDto.ACTIVE,
            organizationMdsId = dummyDevMdsId(1),
            organizationName = "Max's Organization"
        )

        assertThat(result)
            .usingRecursiveComparison()
            .withStrictTypeChecking()
            .isEqualTo(expected)
    }

    @Test
    @TestTransaction
    fun `user-details for authenticated user`() {
        // arrange
        useDevUser(1, 1, setOf(Roles.UserRoles.PARTICIPANT_USER))
        whenever(keycloakService.getUserRoles(dummyDevUserUuid(0))).thenReturn(setOf(Roles.UserRoles.PARTICIPANT_ADMIN))
        whenever(keycloakService.getUserRoles(dummyDevUserUuid(1))).thenReturn(setOf(Roles.UserRoles.PARTICIPANT_USER))

        ScenarioData().apply {
            user(0, 1) {
                it.firstName = "Inviting"
                it.lastName = "User"
            }
            user(1, 1) {
                it.firstName = "Max"
                it.lastName = "Mustermann"
                it.email = "max.mustermann@test.sovity.io"
                it.phone = "+49 176 000000"
                it.jobTitle = null
                it.createdAt = dummyDate(1)
                it.invitedBy = dummyDevUserUuid(0)
                it.onboardingType = UserOnboardingType.INVITATION
            }
            organization(1, 1) {
                it.name = "Max's Organization"
            }
            scenarioInstaller.install(this)
        }

        // act
        val result = uiResource.userDetails(dummyDevUserUuid(1))

        // assert
        val expected = UserDetailDto(
            userId = dummyDevUserUuid(1),
            email = "max.mustermann@test.sovity.io",
            firstName = "Max",
            lastName = "Mustermann",
            phone = "+49 176 000000",
            position = "",
            onboardingType = UserOnboardingTypeDto.INVITATION,
            creationDate = dummyDate(1),
            registrationStatus = UserRegistrationStatusDto.ACTIVE,
            roles = listOf(UserRoleDto.USER),
            organizationMdsId = dummyDevMdsId(1),
            organizationName = "Max's Organization",
            invitingUserId = dummyDevUserUuid(0),
            invitingUserFirstName = "Inviting",
            invitingUserLastName = "User"
        )

        assertThat(result)
            .usingRecursiveComparison()
            .withStrictTypeChecking()
            .withOffsetDateTimeComparator()
            .isEqualTo(expected)
    }
}
