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

package de.sovity.authorityportal.web.tests.services.connector

import de.sovity.authorityportal.api.UiResource
import de.sovity.authorityportal.api.model.CreateCaasRequest
import de.sovity.authorityportal.api.model.CreateConnectorStatusDto
import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.enums.CaasStatus
import de.sovity.authorityportal.db.jooq.enums.ConnectorBrokerRegistrationStatus
import de.sovity.authorityportal.db.jooq.enums.ConnectorContractOffersExceeded
import de.sovity.authorityportal.db.jooq.enums.ConnectorDataOffersExceeded
import de.sovity.authorityportal.db.jooq.enums.ConnectorOnlineStatus
import de.sovity.authorityportal.db.jooq.enums.ConnectorType
import de.sovity.authorityportal.seeds.utils.ScenarioData
import de.sovity.authorityportal.seeds.utils.ScenarioInstaller
import de.sovity.authorityportal.seeds.utils.dummyDevConnectorId
import de.sovity.authorityportal.seeds.utils.dummyDevMdsId
import de.sovity.authorityportal.seeds.utils.dummyDevUserUuid
import de.sovity.authorityportal.web.Roles
import de.sovity.authorityportal.web.tests.useDevUser
import de.sovity.authorityportal.web.tests.useMockNow
import de.sovity.authorityportal.web.tests.withOffsetDateTimeComparator
import de.sovity.authorityportal.web.thirdparty.caas.CaasClient
import de.sovity.authorityportal.web.thirdparty.caas.model.CaasDetails
import de.sovity.authorityportal.web.thirdparty.caas.model.CaasPortalResponse
import de.sovity.authorityportal.web.utils.idmanagement.ClientIdUtils
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
import org.mockito.kotlin.eq
import org.mockito.kotlin.whenever
import java.time.OffsetDateTime

@QuarkusTest
@ExtendWith(MockitoExtension::class)
class CaasManagementApiServiceTest {

    @Inject
    lateinit var uiResource: UiResource

    @Inject
    lateinit var scenarioInstaller: ScenarioInstaller

    @Inject
    lateinit var dsl: DSLContext

    @Inject
    lateinit var clientIdUtils: ClientIdUtils

    @InjectMock
    lateinit var caasClient: CaasClient

    @Test
    @TestTransaction
    fun `create caas creates connector with caas configuration`() {
        // arrange
        val now = OffsetDateTime.now()

        useDevUser(0, 0, setOf(Roles.UserRoles.PARTICIPANT_CURATOR))
        useMockNow(now)

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)

            scenarioInstaller.install(this)
        }

        whenever(caasClient.validateSubdomain(eq("test-caas-1"))).thenReturn(true)
        whenever(caasClient.requestCaas(any())).thenReturn(
            CaasPortalResponse().apply {
                value = CaasDetails(connectorId = dummyDevConnectorId(0, 0))
            }
        )

        val request = CreateCaasRequest(
            connectorSubdomain = "test-caas-1",
            connectorTitle = "Test CaaS",
            connectorDescription = "Connector-as-a-service for testing purposes"
        )

        // act
        val result = uiResource.createCaas("test", request)

        // assert
        assertThat(result).isNotNull
        assertThat(result.id).contains(dummyDevMdsId(0))
        assertThat(result.changedDate).isEqualTo(now)
        assertThat(result.status).isEqualTo(CreateConnectorStatusDto.OK)

        val actual = dsl.selectFrom(Tables.CONNECTOR)
            .where(Tables.CONNECTOR.CONNECTOR_ID.eq(result.id))
            .fetchOne()

        assertThat(actual).isNotNull

        val expected = dsl.newRecord(Tables.CONNECTOR).also {
            it.connectorId = actual!!.connectorId
            it.mdsId = dummyDevMdsId(0)
            it.providerMdsId = null
            it.type = ConnectorType.CAAS
            it.environment = "test"
            it.clientId = clientIdUtils.generateFromConnectorId(it.connectorId)
            it.name = "Test CaaS"
            it.location = "CaaS"
            it.frontendUrl = null
            it.endpointUrl = null
            it.managementUrl = null
            it.createdBy = dummyDevUserUuid(0)
            it.createdAt = now
            it.brokerRegistrationStatus = ConnectorBrokerRegistrationStatus.UNREGISTERED
            it.jwksUrl = null
            it.caasStatus = CaasStatus.PROVISIONING
            it.lastRefreshAttemptAt = null
            it.lastSuccessfulRefreshAt = null
            it.onlineStatus = ConnectorOnlineStatus.DEAD
            it.dataOffersExceeded = ConnectorDataOffersExceeded.OK
            it.contractOffersExceeded = ConnectorContractOffersExceeded.OK
        }

        assertThat(actual!!.copy())
            .usingRecursiveComparison()
            .withOffsetDateTimeComparator()
            .withStrictTypeChecking()
            .isEqualTo(expected.copy())
    }

    @Test
    @TestTransaction
    fun `check free caas slots returns the correct amount`() {
        // arrange
        useDevUser(0, 0, setOf(Roles.UserRoles.PARTICIPANT_CURATOR))

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)
            connector(0, 0, 0) { it.type = ConnectorType.CAAS }
            scenarioInstaller.install(this)
        }

        // act
        val result = uiResource.checkFreeCaasUsage("test")

        // assert
        assertThat(result).isNotNull
        assertThat(result.limit).isEqualTo(1)
        assertThat(result.current).isEqualTo(1)
    }
}
