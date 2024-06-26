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
import de.sovity.authorityportal.api.model.CreateConnectorRequest
import de.sovity.authorityportal.api.model.CreateConnectorStatusDto
import de.sovity.authorityportal.db.jooq.Tables
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
import de.sovity.authorityportal.web.tests.loadTestResource
import de.sovity.authorityportal.web.tests.useDevUser
import de.sovity.authorityportal.web.tests.useMockNow
import de.sovity.authorityportal.web.tests.withOffsetDateTimeComparator
import de.sovity.authorityportal.web.thirdparty.daps.DapsClient
import de.sovity.authorityportal.web.thirdparty.daps.DapsClientService
import de.sovity.authorityportal.web.utils.idmanagement.ClientIdUtils
import io.quarkus.test.InjectMock
import io.quarkus.test.TestTransaction
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import jakarta.ws.rs.NotAuthorizedException
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.jooq.DSLContext
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.any
import org.mockito.kotlin.doNothing
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever
import java.time.OffsetDateTime

@QuarkusTest
@ExtendWith(MockitoExtension::class)
class ConnectorManagementApiServiceTest {

    @Inject
    lateinit var uiResource: UiResource

    @Inject
    lateinit var scenarioInstaller: ScenarioInstaller

    @Inject
    lateinit var dsl: DSLContext

    @Inject
    lateinit var clientIdUtils: ClientIdUtils

    @InjectMock
    lateinit var dapsClientService: DapsClientService

    @Test
    @TestTransaction
    fun `get connector details as authority user`() {
        // arrange
        useDevUser(0, 0, setOf(Roles.UserRoles.AUTHORITY_USER))

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)

            connector(0, 0, 0) {
                it.name = "Connector 0"
            }
            connector(1, 0, 0)
            connector(2, 0, 0)

            scenarioInstaller.install(this)
        }

        // act
        val result = uiResource.getConnector("${dummyDevMdsId(0)}.${dummyDevConnectorId(0)}")

        // assert
        assertThat(result.connectorId).isEqualTo("${dummyDevMdsId(0)}.${dummyDevConnectorId(0)}")
        assertThat(result.connectorName).isEqualTo("Connector 0")
        assertThat(result.orgMdsId).isEqualTo(dummyDevMdsId(0))
    }

    @Test
    @TestTransaction
    fun `get connector details as operator admin`() {
        // arrange
        useDevUser(0, 0, setOf(Roles.UserRoles.OPERATOR_ADMIN))

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)

            connector(0, 0, 0) {
                it.name = "Connector 0"
            }
            connector(1, 0, 0)
            connector(2, 0, 0)

            scenarioInstaller.install(this)
        }

        // act
        val result = uiResource.getConnector("${dummyDevMdsId(0)}.${dummyDevConnectorId(0)}")

        // assert
        assertThat(result.connectorId).isEqualTo("${dummyDevMdsId(0)}.${dummyDevConnectorId(0)}")
        assertThat(result.connectorName).isEqualTo("Connector 0")
        assertThat(result.orgMdsId).isEqualTo(dummyDevMdsId(0))
    }

    @Test
    @TestTransaction
    fun `get all connectors as authority user for environment test shows only connectors from that env`() {
        // arrange
        useDevUser(0, 0, setOf(Roles.UserRoles.AUTHORITY_USER))

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)

            connector(0, 0, 0)
            connector(1, 0, 0)

            connector(2, 0, 0) {
                it.environment = "other-environment"
            }

            scenarioInstaller.install(this)
        }

        // act
        val result = uiResource.getAllConnectors("test")

        // assert
        assertThat(result.connectors).hasSize(2)
        assertThat(result.connectors).noneMatch { it.environment.environmentId != "test" }
        assertThat(result.connectors).noneMatch { it.id == "${dummyDevMdsId(0)}.${dummyDevConnectorId(2)}" }

        assertThat(result.connectors[0].id).isEqualTo("${dummyDevMdsId(0)}.${dummyDevConnectorId(0)}")
        assertThat(result.connectors[1].id).isEqualTo("${dummyDevMdsId(0)}.${dummyDevConnectorId(1)}")
    }

    @Test
    @TestTransaction
    fun `get all connectors as operator admin for different environment shows only connectors from that env`() {
        // arrange
        useDevUser(0, 0, setOf(Roles.UserRoles.OPERATOR_ADMIN))

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)

            connector(0, 0, 0)
            connector(1, 0, 0)

            connector(2, 0, 0) {
                it.environment = "other-environment"
            }

            scenarioInstaller.install(this)
        }

        // act
        val result = uiResource.getAllConnectors("other-environment")

        // assert
        assertThat(result.connectors).hasSize(1)
        assertThat(result.connectors).noneMatch { it.environment.environmentId != "other-environment" }
        assertThat(result.connectors).noneMatch { it.id == "${dummyDevMdsId(0)}.${dummyDevConnectorId(0)}" }
        assertThat(result.connectors).noneMatch { it.id == "${dummyDevMdsId(0)}.${dummyDevConnectorId(1)}" }

        assertThat(result.connectors[0].id).isEqualTo("${dummyDevMdsId(0)}.${dummyDevConnectorId(2)}")
        assertThat(result.connectors[0].environment.environmentId).isEqualTo("other-environment")
    }

    @Test
    @TestTransaction
    fun `get provided connectors returns all connectors where user mdsId is host but not owner`() {
        // arrange
        useDevUser(0, 0, setOf(Roles.UserRoles.SERVICE_PARTNER_ADMIN))

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)
            connector(0, 0, 0)

            organization(1, 1)
            user(1, 1)

            connector(1, 1, 0) {
                it.providerMdsId = dummyDevMdsId(0)
            }
            connector(2, 1, 0) {
                it.providerMdsId = dummyDevMdsId(0)
            }

            scenarioInstaller.install(this)
        }

        // act
        val result = uiResource.getProvidedConnectors("test")

        // assert
        assertThat(result.connectors).hasSize(2)
        assertThat(result.connectors).noneMatch { it.environment.environmentId != "test" }
        assertThat(result.connectors).noneMatch { it.id == "${dummyDevMdsId(0)}.${dummyDevConnectorId(0)}" }

        assertThat(result.connectors[0].id).isEqualTo("${dummyDevMdsId(1)}.${dummyDevConnectorId(1)}")
        assertThat(result.connectors[1].id).isEqualTo("${dummyDevMdsId(1)}.${dummyDevConnectorId(2)}")
    }

    @Test
    @TestTransaction
    fun `get provided connector details with valid provided connectorId`() {
        // arrange
        useDevUser(0, 0, setOf(Roles.UserRoles.SERVICE_PARTNER_ADMIN))

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)
            connector(0, 0, 0)

            organization(1, 1)
            user(1, 1)

            connector(1, 1, 0) {
                it.providerMdsId = dummyDevMdsId(0)
                it.name = "Connector 1"
            }
            connector(2, 1, 0) {
                it.providerMdsId = dummyDevMdsId(0)
                it.name = "Connector 2"
            }

            scenarioInstaller.install(this)
        }

        // act
        val result = uiResource.getProvidedConnectorDetails("${dummyDevMdsId(1)}.${dummyDevConnectorId(1)}")

        // assert
        assertThat(result.connectorId).isEqualTo("${dummyDevMdsId(1)}.${dummyDevConnectorId(1)}")
        assertThat(result.connectorName).isEqualTo("Connector 1")
        assertThat(result.orgMdsId).isEqualTo(dummyDevMdsId(1))
        assertThat(result.hostMdsId).isEqualTo(dummyDevMdsId(0))
        assertThat(result.hostName).isEqualTo("Organization 0")
    }

    @Test
    @TestTransaction
    fun `get provided connector details with connectorId not hosted by user org`() {
        // arrange
        useDevUser(0, 0, setOf(Roles.UserRoles.SERVICE_PARTNER_ADMIN))

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)
            connector(0, 0, 0)

            organization(1, 1)
            user(1, 1)

            connector(1, 1, 0) {
                it.providerMdsId = dummyDevMdsId(1)
                it.name = "Connector 1"
            }
            connector(2, 1, 0) {
                it.providerMdsId = dummyDevMdsId(1)
                it.name = "Connector 2"
            }

            scenarioInstaller.install(this)
        }

        // act & assert
        assertThatThrownBy {
            uiResource.getProvidedConnectorDetails("${dummyDevMdsId(1)}.${dummyDevConnectorId(1)}")
        }.isInstanceOf(IllegalStateException::class.java)
            .hasMessageContaining("Connector ID does not match with organization or host organization")
    }

    @Test
    @TestTransaction
    fun `delete self-hosted connector`() {
        // arrange
        useDevUser(0, 0, setOf(Roles.UserRoles.PARTICIPANT_CURATOR))

        val dapsClient = mock<DapsClient>()
        whenever(dapsClientService.forEnvironment(any())).thenReturn(dapsClient)
        doNothing().whenever(dapsClient).deleteClient(any())

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)
            connector(0, 0, 0)

            scenarioInstaller.install(this)
        }

        // act
        val result = uiResource.deleteOwnConnector("${dummyDevMdsId(0)}.${dummyDevConnectorId(0)}")

        // assert
        val connectorCountQuery = dsl.selectCount()
            .from(Tables.CONNECTOR)
            .where(Tables.CONNECTOR.CONNECTOR_ID.eq("${dummyDevMdsId(0)}.${dummyDevConnectorId(0)}"))
            .fetchOne(0, Int::class.java)

        assertThat(result).isNotNull
        assertThat(result.id).isEqualTo("${dummyDevMdsId(0)}.${dummyDevConnectorId(0)}")
        assertThat(connectorCountQuery).isEqualTo(0)
    }

    @Test
    @TestTransaction
    fun `delete provided connector`() {
        // arrange
        useDevUser(0, 0, setOf(Roles.UserRoles.SERVICE_PARTNER_ADMIN))

        val dapsClient = mock<DapsClient>()
        whenever(dapsClientService.forEnvironment(any())).thenReturn(dapsClient)
        doNothing().whenever(dapsClient).deleteClient(any())

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)

            organization(1, 1)
            user(1, 1)
            connector(0, 1, 0) {
                it.providerMdsId = dummyDevMdsId(0)
            }

            scenarioInstaller.install(this)
        }

        // act
        val result = uiResource.deleteProvidedConnector("${dummyDevMdsId(1)}.${dummyDevConnectorId(0)}")

        // assert
        val connectorCountQuery = dsl.selectCount()
            .from(Tables.CONNECTOR)
            .where(Tables.CONNECTOR.CONNECTOR_ID.eq("${dummyDevMdsId(1)}.${dummyDevConnectorId(0)}"))
            .fetchOne(0, Int::class.java)

        assertThat(result).isNotNull
        assertThat(result.id).isEqualTo("${dummyDevMdsId(1)}.${dummyDevConnectorId(0)}")
        assertThat(connectorCountQuery).isEqualTo(0)
    }

    @Test
    @TestTransaction
    fun `get own organization connectors does not show other connectors than own`() {
        // arrange
        useDevUser(0, 0, setOf(Roles.UserRoles.PARTICIPANT_USER))

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)
            connector(0, 0, 0)
            connector(1, 0, 0)
            connector(2, 0, 0)

            organization(1, 1)
            user(1, 1)
            connector(3, 1, 0)

            scenarioInstaller.install(this)
        }

        // act
        val result = uiResource.ownOrganizationConnectors("test")

        // assert
        assertThat(result.connectors).hasSize(3)
        assertThat(result.connectors).noneMatch { it.id == "${dummyDevMdsId(1)}.${dummyDevConnectorId(3)}" }
        assertThat(result.connectors).noneMatch { it.environment.environmentId != "test" }
        assertThat(result.connectors[0].id).isEqualTo("${dummyDevMdsId(0)}.${dummyDevConnectorId(0)}")
        assertThat(result.connectors[1].id).isEqualTo("${dummyDevMdsId(0)}.${dummyDevConnectorId(1)}")
        assertThat(result.connectors[2].id).isEqualTo("${dummyDevMdsId(0)}.${dummyDevConnectorId(2)}")
    }

    @Test
    @TestTransaction
    fun `get own connector details fails for other organization connector`() {
        // arrange
        useDevUser(0, 0, setOf(Roles.UserRoles.PARTICIPANT_USER))

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)
            connector(0, 0, 0)
            connector(1, 0, 0)
            connector(2, 0, 0)

            organization(1, 1)
            user(1, 1)
            connector(3, 1, 0)

            scenarioInstaller.install(this)
        }

        // act & assert
        assertThatThrownBy {
            uiResource.ownOrganizationConnectorDetails("${dummyDevMdsId(1)}.${dummyDevConnectorId(3)}")
        }
            .isInstanceOf(IllegalStateException::class.java)
            .hasMessage("Connector ID does not match with organization or host organization")
    }

    @Test
    @TestTransaction
    fun `create own connector creates a connector for user organization`() {
        // arrange
        val now = OffsetDateTime.now()

        useDevUser(0, 0, setOf(Roles.UserRoles.PARTICIPANT_CURATOR))
        useMockNow(now)

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)
            scenarioInstaller.install(this)
        }

        val dapsClient = mock<DapsClient>()

        whenever(dapsClientService.forEnvironment(any())).thenReturn(dapsClient)
        doNothing().whenever(dapsClient).createClient(any())
        doNothing().whenever(dapsClient).addCertificate(any(), any())
        doNothing().whenever(dapsClient).configureMappers(any(), any(), any())

        val request = CreateConnectorRequest(
            name = "Test Connector",
            location = "DE",
            frontendUrl = "https://connector.test.sovity.io/",
            endpointUrl = "https://connector.test.sovity.io/dsp/",
            managementUrl = "https://connector.test.sovity.io/api/management/",
            certificate = loadTestResource("create-connector-certificate.pem")
        )

        // act
        val result = uiResource.createOwnConnector("test", request)

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
            it.connectorId = actual!!.connectorId // id is generated, so we can only predict the first part of it
            it.mdsId = dummyDevMdsId(0)
            it.providerMdsId = it.mdsId
            it.type = ConnectorType.OWN
            it.environment = "test"
            it.clientId = clientIdUtils.generateFromCertificate(request.certificate)
            it.name = "Test Connector"
            it.location = "DE"
            it.frontendUrl = "https://connector.test.sovity.io" // service should remove trailing slashes
            it.endpointUrl = "https://connector.test.sovity.io/dsp" // service should remove trailing slashes
            it.managementUrl = "https://connector.test.sovity.io/api/management" // service should remove trailing slashes
            it.createdBy = dummyDevUserUuid(0)
            it.createdAt = now
            it.brokerRegistrationStatus = ConnectorBrokerRegistrationStatus.UNREGISTERED
            it.jwksUrl = null
            it.caasStatus = null
            it.lastRefreshAttemptAt = null
            it.lastSuccessfulRefreshAt = null
            it.onlineStatus = ConnectorOnlineStatus.DEAD
            it.dataOffersExceeded = ConnectorDataOffersExceeded.UNKNOWN
            it.contractOffersExceeded = ConnectorContractOffersExceeded.UNKNOWN
        }

        assertThat(actual!!.copy())
            .usingRecursiveComparison()
            .withOffsetDateTimeComparator()
            .withStrictTypeChecking()
            .isEqualTo(expected.copy())
    }

    @Test
    @TestTransaction
    fun `create own connector fails because of invalid urls`() {
        // arrange
        val now = OffsetDateTime.now()

        useDevUser(0, 0, setOf(Roles.UserRoles.PARTICIPANT_CURATOR))
        useMockNow(now)

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)
            scenarioInstaller.install(this)
        }

        val request = CreateConnectorRequest(
            name = "Test Connector",
            location = "DE",
            frontendUrl = "http://connector.test.sovity.io/",
            endpointUrl = "http://connector.test.sovity.io/dsp/",
            managementUrl = "http://connector.test.sovity.io/api/management/",
            certificate = loadTestResource("create-connector-certificate.pem")
        )

        // act
        val result = uiResource.createOwnConnector("test", request)

        // assert
        assertThat(result).isNotNull
        assertThat(result.id).isNull()
        assertThat(result.changedDate).isEqualTo(now)
        assertThat(result.status).isEqualTo(CreateConnectorStatusDto.ERROR)
        assertThat(result.message).isEqualTo("Connector URL is not valid.")
    }

    @Test
    @TestTransaction
    fun `create own connector fails because certificate was already used`() {
        // arrange
        val now = OffsetDateTime.now()
        val certificate = loadTestResource("create-connector-certificate.pem")

        useDevUser(0, 0, setOf(Roles.UserRoles.PARTICIPANT_CURATOR))
        useMockNow(now)

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)
            connector(0, 0, 0) {
                it.clientId = clientIdUtils.generateFromCertificate(certificate)
            }
            scenarioInstaller.install(this)
        }

        val request = CreateConnectorRequest(
            name = "Test Connector",
            location = "DE",
            frontendUrl = "https://connector.test.sovity.io/",
            endpointUrl = "https://connector.test.sovity.io/dsp/",
            managementUrl = "https://connector.test.sovity.io/api/management/",
            certificate = certificate
        )

        // act
        val result = uiResource.createOwnConnector("test", request)

        // assert
        assertThat(result).isNotNull
        assertThat(result.id).isNull()
        assertThat(result.changedDate).isEqualTo(now)
        assertThat(result.status).isEqualTo(CreateConnectorStatusDto.ERROR)
        assertThat(result.message).contains("Connector with this certificate already exists.")
    }

    @Test
    @TestTransaction
    fun `create provided connector creates a connector for target organization`() {
        // arrange
        val now = OffsetDateTime.now()

        useDevUser(0, 0, setOf(Roles.UserRoles.SERVICE_PARTNER_ADMIN))
        useMockNow(now)

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)

            organization(1, 1)
            user(1, 1)

            scenarioInstaller.install(this)
        }

        val dapsClient = mock<DapsClient>()

        whenever(dapsClientService.forEnvironment(any())).thenReturn(dapsClient)
        doNothing().whenever(dapsClient).createClient(any())
        doNothing().whenever(dapsClient).addCertificate(any(), any())
        doNothing().whenever(dapsClient).configureMappers(any(), any(), any())

        val request = CreateConnectorRequest(
            name = "Test Connector",
            location = "DE",
            frontendUrl = "https://connector.test.sovity.io/",
            endpointUrl = "https://connector.test.sovity.io/dsp/",
            managementUrl = "https://connector.test.sovity.io/api/management/",
            certificate = loadTestResource("create-connector-certificate.pem")
        )

        // act
        val result = uiResource.createProvidedConnector(dummyDevMdsId(1),"test", request)

        // assert
        assertThat(result).isNotNull
        assertThat(result.id).contains(dummyDevMdsId(1))
        assertThat(result.changedDate).isEqualTo(now)
        assertThat(result.status).isEqualTo(CreateConnectorStatusDto.OK)

        val actual = dsl.selectFrom(Tables.CONNECTOR)
            .where(Tables.CONNECTOR.CONNECTOR_ID.eq(result.id))
            .fetchOne()

        assertThat(actual).isNotNull

        val expected = dsl.newRecord(Tables.CONNECTOR).also {
            it.connectorId = actual!!.connectorId // id is generated, so we can only predict the first part of it
            it.mdsId = dummyDevMdsId(1)
            it.providerMdsId = dummyDevMdsId(0)
            it.type = ConnectorType.PROVIDED
            it.environment = "test"
            it.clientId = clientIdUtils.generateFromCertificate(request.certificate)
            it.name = "Test Connector"
            it.location = "DE"
            it.frontendUrl = "https://connector.test.sovity.io" // service should remove trailing slashes
            it.endpointUrl = "https://connector.test.sovity.io/dsp" // service should remove trailing slashes
            it.managementUrl = "https://connector.test.sovity.io/api/management" // service should remove trailing slashes
            it.createdBy = dummyDevUserUuid(0)
            it.createdAt = now
            it.brokerRegistrationStatus = ConnectorBrokerRegistrationStatus.UNREGISTERED
            it.jwksUrl = null
            it.caasStatus = null
            it.lastRefreshAttemptAt = null
            it.lastSuccessfulRefreshAt = null
            it.onlineStatus = ConnectorOnlineStatus.DEAD
            it.dataOffersExceeded = ConnectorDataOffersExceeded.UNKNOWN
            it.contractOffersExceeded = ConnectorContractOffersExceeded.UNKNOWN
        }

        assertThat(actual!!.copy())
            .usingRecursiveComparison()
            .withOffsetDateTimeComparator()
            .withStrictTypeChecking()
            .isEqualTo(expected.copy())
    }

    @Test
    @TestTransaction
    fun `create provided connector fails because of invalid urls`() {
        // arrange
        val now = OffsetDateTime.now()

        useDevUser(0, 0, setOf(Roles.UserRoles.SERVICE_PARTNER_ADMIN))
        useMockNow(now)

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)

            organization(1, 1)
            user(1, 1)

            scenarioInstaller.install(this)
        }

        val request = CreateConnectorRequest(
            name = "Test Connector",
            location = "DE",
            frontendUrl = "http://connector.test.sovity.io/",
            endpointUrl = "http://connector.test.sovity.io/dsp/",
            managementUrl = "http://connector.test.sovity.io/api/management/",
            certificate = loadTestResource("create-connector-certificate.pem")
        )

        // act
        val result = uiResource.createProvidedConnector(dummyDevMdsId(1), "test", request)

        // assert
        assertThat(result).isNotNull
        assertThat(result.id).isNull()
        assertThat(result.changedDate).isEqualTo(now)
        assertThat(result.status).isEqualTo(CreateConnectorStatusDto.ERROR)
        assertThat(result.message).isEqualTo("Connector URL is not valid.")
    }

    @Test
    @TestTransaction
    fun `create provided connector fails because certificate was already used`() {
        // arrange
        val now = OffsetDateTime.now()
        val certificate = loadTestResource("create-connector-certificate.pem")

        useDevUser(0, 0, setOf(Roles.UserRoles.SERVICE_PARTNER_ADMIN))
        useMockNow(now)

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)

            organization(1, 1)
            user(1, 1)

            connector(0, 1, 0) {
                it.clientId = clientIdUtils.generateFromCertificate(certificate)
            }
            scenarioInstaller.install(this)
        }

        val request = CreateConnectorRequest(
            name = "Test Connector",
            location = "DE",
            frontendUrl = "https://connector.test.sovity.io/",
            endpointUrl = "https://connector.test.sovity.io/dsp/",
            managementUrl = "https://connector.test.sovity.io/api/management/",
            certificate = certificate
        )

        // act
        val result = uiResource.createProvidedConnector(dummyDevMdsId(1), "test", request)

        // assert
        assertThat(result).isNotNull
        assertThat(result.id).isNull()
        assertThat(result.changedDate).isEqualTo(now)
        assertThat(result.status).isEqualTo(CreateConnectorStatusDto.ERROR)
        assertThat(result.message).contains("Connector with this certificate already exists.")
    }

    @Test
    @TestTransaction
    fun `create provided connector fails because of insufficient permissions`() {
        // arrange
        useDevUser(0, 0, setOf(Roles.UserRoles.PARTICIPANT_CURATOR))

        val request = CreateConnectorRequest(
            name = "Test Connector",
            location = "DE",
            frontendUrl = "https://connector.test.sovity.io/",
            endpointUrl = "https://connector.test.sovity.io/dsp/",
            managementUrl = "https://connector.test.sovity.io/api/management/",
            certificate = loadTestResource("create-connector-certificate.pem")
        )

        // act & assert
        assertThatThrownBy { uiResource.createProvidedConnector(dummyDevMdsId(1), "test", request) }
            .isInstanceOf(NotAuthorizedException::class.java)
    }
}
