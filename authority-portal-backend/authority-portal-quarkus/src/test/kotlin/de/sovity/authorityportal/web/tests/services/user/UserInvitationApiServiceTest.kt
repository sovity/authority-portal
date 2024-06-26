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
import de.sovity.authorityportal.api.model.InviteParticipantUserRequest
import de.sovity.authorityportal.api.model.UserRoleDto
import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.enums.UserOnboardingType
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.seeds.utils.ScenarioData
import de.sovity.authorityportal.seeds.utils.ScenarioInstaller
import de.sovity.authorityportal.seeds.utils.dummyDevMdsId
import de.sovity.authorityportal.seeds.utils.dummyDevUserUuid
import de.sovity.authorityportal.web.Roles
import de.sovity.authorityportal.web.tests.useDevUser
import de.sovity.authorityportal.web.tests.useMockNow
import de.sovity.authorityportal.web.tests.withOffsetDateTimeComparator
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import io.quarkus.test.InjectMock
import io.quarkus.test.TestTransaction
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.assertj.core.api.Assertions.assertThat
import org.jooq.DSLContext
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.any
import org.mockito.kotlin.doNothing
import org.mockito.kotlin.eq
import org.mockito.kotlin.isNull
import org.mockito.kotlin.whenever
import java.time.OffsetDateTime

@QuarkusTest
@ExtendWith(MockitoExtension::class)
class UserInvitationApiServiceTest {

    @Inject
    lateinit var uiResource: UiResource

    @Inject
    lateinit var scenarioInstaller: ScenarioInstaller

    @Inject
    lateinit var dsl: DSLContext

    @InjectMock
    lateinit var keycloakService: KeycloakService

    @Test
    @TestTransaction
    fun `invite user with a valid request`() {
        // arrange
        val now = OffsetDateTime.now()

        useDevUser(0, 0, setOf(Roles.UserRoles.PARTICIPANT_ADMIN))
        useMockNow(now)

        whenever(keycloakService.createUser(
            eq("max.mustermann@test.sovity.io"),
            eq("Max"),
            eq("Mustermann"),
            isNull()
        )).thenReturn(dummyDevUserUuid(1))

        doNothing().whenever(keycloakService).joinOrganization(any(), any(), any())
        doNothing().whenever(keycloakService).sendInvitationEmail(any())

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)
            scenarioInstaller.install(this)
        }

        val payload = InviteParticipantUserRequest(
            email = "max.mustermann@test.sovity.io",
            firstName = "Max",
            lastName = "Mustermann",
            role = UserRoleDto.USER
        )

        // act
        val result = uiResource.inviteUser(payload)

        // assert
        val expected = dsl.newRecord(Tables.USER).also {
            it.id = dummyDevUserUuid(1)
            it.firstName = "Max"
            it.lastName = "Mustermann"
            it.email = "max.mustermann@test.sovity.io"
            it.organizationMdsId = dummyDevMdsId(0)
            it.registrationStatus = UserRegistrationStatus.INVITED
            it.createdAt = now
            it.onboardingType = UserOnboardingType.INVITATION
            it.invitedBy = dummyDevUserUuid(0)
        }

        assertThat(result).isNotNull
        assertThat(result.id).isEqualTo(dummyDevUserUuid(1))

        val actual = dsl.selectFrom(Tables.USER).where(Tables.USER.ID.eq(dummyDevUserUuid(1))).fetchOne()
        assertThat(actual).isNotNull()

        assertThat(actual!!.copy())
            .usingRecursiveComparison()
            .withOffsetDateTimeComparator()
            .isEqualTo(expected.copy())
    }
}
