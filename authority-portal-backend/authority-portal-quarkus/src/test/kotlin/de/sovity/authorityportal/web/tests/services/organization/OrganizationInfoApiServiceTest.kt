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

package de.sovity.authorityportal.web.tests.services.organization

import com.fasterxml.jackson.databind.ObjectMapper
import de.sovity.authorityportal.api.UiResource
import de.sovity.authorityportal.seeds.utils.ScenarioData
import de.sovity.authorityportal.seeds.utils.ScenarioInstaller
import de.sovity.authorityportal.seeds.utils.dummyDevAssetId
import de.sovity.authorityportal.seeds.utils.dummyDevOrganizationId
import de.sovity.authorityportal.seeds.utils.dummyDevUserUuid
import de.sovity.authorityportal.web.Roles
import de.sovity.authorityportal.web.tests.useDevUser
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import de.sovity.authorityportal.web.thirdparty.keycloak.model.KeycloakUserDto
import de.sovity.edc.ext.wrapper.api.common.model.DataSourceAvailability
import de.sovity.edc.ext.wrapper.api.common.model.UiAsset
import io.quarkus.test.InjectMock
import io.quarkus.test.TestTransaction
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.assertj.core.api.Assertions.assertThat
import org.jooq.JSONB
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.any
import org.mockito.kotlin.whenever

@QuarkusTest
@ExtendWith(MockitoExtension::class)
class OrganizationInfoApiServiceTest {

    @Inject
    lateinit var uiResource: UiResource

    @Inject
    lateinit var scenarioInstaller: ScenarioInstaller

    @Inject
    lateinit var objectMapper: ObjectMapper

    @InjectMock
    lateinit var keycloakService: KeycloakService

    @Test
    @TestTransaction
    fun `organization overview for authority users`() {
        // arrange
        useDevUser(0, 0, setOf(Roles.UserRoles.AUTHORITY_USER))

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)
            connector(0, 0, 0)
            connector(1, 0, 0)
            connector(2, 0, 0)

            organization(1, 1)
            user(1, 1)
            connector(3, 1, 1)

            organization(2, 2)
            user(2, 2)
            user(3, 2)

            scenarioInstaller.install(this)
        }

        // act
        val result = uiResource.organizationsOverviewForAuthority("test")

        // assert
        assertThat(result.organizations).hasSize(3)

        assertThat(result.organizations[0].id).isEqualTo(dummyDevOrganizationId(0))
        assertThat(result.organizations[0].name).isEqualTo("Organization 0")
        assertThat(result.organizations[0].connectorCount).isEqualTo(3)
        assertThat(result.organizations[0].userCount).isEqualTo(1)

        assertThat(result.organizations[1].id).isEqualTo(dummyDevOrganizationId(1))
        assertThat(result.organizations[1].name).isEqualTo("Organization 1")
        assertThat(result.organizations[1].connectorCount).isEqualTo(1)
        assertThat(result.organizations[1].userCount).isEqualTo(1)

        assertThat(result.organizations[2].id).isEqualTo(dummyDevOrganizationId(2))
        assertThat(result.organizations[2].name).isEqualTo("Organization 2")
        assertThat(result.organizations[2].connectorCount).isEqualTo(0)
        assertThat(result.organizations[2].userCount).isEqualTo(2)
    }

    @Test
    @TestTransaction
    fun `organization overview for service partner admins does not contain own organization`() {
        // arrange
        useDevUser(0, 0, setOf(Roles.UserRoles.SERVICE_PARTNER_ADMIN))

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)
            connector(0, 0, 0)
            connector(1, 0, 0)
            connector(2, 0, 0)

            organization(1, 1)
            user(1, 1)
            connector(3, 1, 1)

            organization(2, 2)
            user(2, 2)
            user(3, 2)

            scenarioInstaller.install(this)
        }

        // act
        val result = uiResource.organizationsOverviewForProvidingConnectors("test")

        // assert
        assertThat(result.organizations).hasSize(2)

        assertThat(result.organizations).noneMatch { it.id == dummyDevOrganizationId(0) }
        assertThat(result.organizations).noneMatch { it.name == "Organization 0"}

        assertThat(result.organizations[0].id).isEqualTo(dummyDevOrganizationId(1))
        assertThat(result.organizations[0].name).isEqualTo("Organization 1")
        assertThat(result.organizations[0].connectorCount).isEqualTo(1)
        assertThat(result.organizations[0].userCount).isEqualTo(1)

        assertThat(result.organizations[1].id).isEqualTo(dummyDevOrganizationId(2))
        assertThat(result.organizations[1].name).isEqualTo("Organization 2")
        assertThat(result.organizations[1].connectorCount).isEqualTo(0)
        assertThat(result.organizations[1].userCount).isEqualTo(2)
    }

    @Test
    @TestTransaction
    fun `organization overview for authority users in different environment does not return connectors from test env`() {
        // arrange
        useDevUser(0, 0, setOf(Roles.UserRoles.AUTHORITY_USER))

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)
            connector(0, 0, 0)
            connector(1, 0, 0)
            connector(2, 0, 0)

            organization(1, 1)
            user(1, 1)
            connector(3, 1, 1)

            organization(2, 2)
            user(2, 2)
            user(3, 2)

            scenarioInstaller.install(this)
        }

        // act
        val result = uiResource.organizationsOverviewForAuthority("other-environment")

        // assert
        assertThat(result.organizations).hasSize(3)

        assertThat(result.organizations[0].id).isEqualTo(dummyDevOrganizationId(0))
        assertThat(result.organizations[0].name).isEqualTo("Organization 0")
        assertThat(result.organizations[0].connectorCount).isEqualTo(0)
        assertThat(result.organizations[0].userCount).isEqualTo(1)

        assertThat(result.organizations[1].id).isEqualTo(dummyDevOrganizationId(1))
        assertThat(result.organizations[1].name).isEqualTo("Organization 1")
        assertThat(result.organizations[1].connectorCount).isEqualTo(0)
        assertThat(result.organizations[1].userCount).isEqualTo(1)

        assertThat(result.organizations[2].id).isEqualTo(dummyDevOrganizationId(2))
        assertThat(result.organizations[2].name).isEqualTo("Organization 2")
        assertThat(result.organizations[2].connectorCount).isEqualTo(0)
        assertThat(result.organizations[2].userCount).isEqualTo(2)
    }

    @Test
    @TestTransaction
    fun `own organization details`() {
        // arrange
        useDevUser(0, 0, setOf(Roles.UserRoles.PARTICIPANT_USER))

        val expectedMembers = listOf(
            KeycloakUserDto(dummyDevUserUuid(0), "Test", "User", "test@mail"),
            KeycloakUserDto(dummyDevUserUuid(1), "Test", "User", "test2@mail")
        )

        whenever(keycloakService.getOrganizationMembers(dummyDevOrganizationId(0))).thenReturn(expectedMembers)
        whenever(keycloakService.getUserRoles(any())).thenReturn(setOf(Roles.UserRoles.PARTICIPANT_USER))

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)
            user(1, 0)

            organization(1, 1)
            user(2, 1)

            scenarioInstaller.install(this)
        }

        // act
        val result = uiResource.ownOrganizationDetails("test")

        // assert
        assertThat(result.id).isEqualTo(dummyDevOrganizationId(0))
        assertThat(result.name).isEqualTo("Organization 0")
        assertThat(result.memberList).hasSize(2)
    }

    @Test
    @TestTransaction
    fun `organization details for authority`() {
        // arrange
        useDevUser(0, 0, setOf(Roles.UserRoles.AUTHORITY_USER))

        val expectedMembers = listOf(
            KeycloakUserDto(dummyDevUserUuid(2), "Test", "User", "test2@mail")
        )

        whenever(keycloakService.getOrganizationMembers(dummyDevOrganizationId(1))).thenReturn(expectedMembers)

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)
            user(1, 0)

            organization(1, 1)
            user(2, 1)

            scenarioInstaller.install(this)
        }

        // act
        val result = uiResource.organizationDetailsForAuthority(dummyDevOrganizationId(1), "test")

        // assert
        assertThat(result.id).isEqualTo(dummyDevOrganizationId(1))
        assertThat(result.name).isEqualTo("Organization 1")
        assertThat(result.memberList).hasSize(1)
    }

    @Test
    @TestTransaction
    fun `organization details for authority show correct number of data offers`() {
        // arrange
        useDevUser(0, 0, setOf(Roles.UserRoles.AUTHORITY_USER))

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)
            connector(0, 0, 0)

            val uiAsset1 = UiAsset().also {
                it.assetId = dummyDevAssetId(0)
                it.title = "Data Offer 0"
                it.dataCategory = "Data Category 0"
                it.description = "Data Offer 0 Description"
                it.dataSourceAvailability = DataSourceAvailability.ON_REQUEST
            }

            // On request
            dataOffer(0, 0, 0, 0) {
                it.uiAssetJson = JSONB.valueOf(objectMapper.writeValueAsString(uiAsset1))
            }
            // Live offer
            dataOffer(0, 0, 1, 0)

            scenarioInstaller.install(this)
        }

        // act
        val result = uiResource.organizationDetailsForAuthority(dummyDevOrganizationId(0), "test")

        // assert
        assertThat(result.id).isEqualTo(dummyDevOrganizationId(0))
        assertThat(result.name).isEqualTo("Organization 0")
        assertThat(result.dataOfferCount).isEqualTo(2)
        assertThat(result.liveDataOfferCount).isEqualTo(1)
        assertThat(result.onRequestDataOfferCount).isEqualTo(1)
    }

    @Test
    @TestTransaction
    fun `organization overview shows correct numbers of data offers`() {
        // arrange
        useDevUser(0, 0, setOf(Roles.UserRoles.AUTHORITY_USER))

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)
            connector(0, 0, 0)

            organization(1, 1)
            user(1, 1)
            connector(1, 1, 1)

            val uiAsset1 = UiAsset().also {
                it.assetId = dummyDevAssetId(0)
                it.title = "Data Offer 0"
                it.dataCategory = "Data Category 0"
                it.description = "Data Offer 0 Description"
                it.dataSourceAvailability = DataSourceAvailability.ON_REQUEST
            }

            // On request
            dataOffer(0, 0, 0, 0) {
                it.uiAssetJson = JSONB.valueOf(objectMapper.writeValueAsString(uiAsset1))
            }
            // Live offer
            dataOffer(0, 0, 1, 0)
            dataOffer(1, 1, 2, 0)
            dataOffer(1, 1, 3, 0)

            scenarioInstaller.install(this)
        }

        // act
        val result = uiResource.organizationsOverviewForAuthority("test")

        // assert
        assertThat(result.organizations.size).isEqualTo(2)
        assertThat(result.organizations[0].dataOfferCount).isEqualTo(2)
        assertThat(result.organizations[0].liveDataOfferCount).isEqualTo(1)
        assertThat(result.organizations[0].onRequestDataOfferCount).isEqualTo(1)
        assertThat(result.organizations[1].dataOfferCount).isEqualTo(2)
        assertThat(result.organizations[1].liveDataOfferCount).isEqualTo(2)
        assertThat(result.organizations[1].onRequestDataOfferCount).isEqualTo(0)
    }
}
