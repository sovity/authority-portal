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

package de.sovity.authorityportal.web.integration.pages.usermanagement

import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.enums.OrganizationRegistrationStatus
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.web.pages.usermanagement.UnconfirmedUserDeletionService
import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.services.UserService
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import io.quarkus.test.junit.QuarkusMock
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.jooq.DSLContext
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.Mockito.doNothing
import org.mockito.Mockito.mock
import java.time.OffsetDateTime

@QuarkusTest
class UnconfirmedUserDeletionServiceTest {

    @Inject
    lateinit var userService: UserService

    @Inject
    lateinit var organizationService: OrganizationService

    @Inject
    lateinit var unconfirmedUserDeletionService: UnconfirmedUserDeletionService

    @Inject
    lateinit var dsl: DSLContext

    @BeforeEach
    fun setup() {
        dsl.newRecord(Tables.USER).also {
            it.id = "testId"
            it.email = "email"
            it.registrationStatus = UserRegistrationStatus.INVITED
            it.createdAt = OffsetDateTime.now().minusSeconds(43200)
            it.insert()
        }
        dsl.newRecord(Tables.ORGANIZATION).also {
            it.mdsId = "MDSTEST1"
            it.name = "test"
            it.address = "test"
            it.url = "test"
            it.taxId = "test"
            it.createdBy = "testId"
            it.registrationStatus = OrganizationRegistrationStatus.INVITED
            it.createdAt = OffsetDateTime.now().minusSeconds(43200)
            it.insert()
        }
    }

    @Test
    fun deleteUnconfirmedUsersAndOrganizationsTest() {
        // arrange
        val keycloakService = mock(KeycloakService::class.java)
        doNothing().`when`(keycloakService).deleteOrganization("MDSTEST1")
        doNothing().`when`(keycloakService).deleteUser("testId")
        QuarkusMock.installMockForType(keycloakService, KeycloakService::class.java)

        // act
        unconfirmedUserDeletionService.deleteUnconfirmedUsersAndOrganizations()

        // assert
        assertThrows<Exception> { organizationService.getOrganizationOrThrow("MDSTEST1") }
        assertThrows<Exception> { userService.getUserOrThrow("testId") }
    }
}
