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
package de.sovity.authorityportal.web.thirdparty.broker

import de.sovity.authorityportal.api.model.CreateConnectorRequest
import de.sovity.authorityportal.web.services.ConnectorService
import io.quarkus.test.junit.QuarkusMock
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.anyString
import org.mockito.Mockito.mock
import org.mockito.Mockito.`when`
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.any
import org.mockito.kotlin.verify

@QuarkusTest
@ExtendWith(MockitoExtension::class)
class BrokerSyncServiceTest {

    @Inject
    lateinit var connectorService: ConnectorService

    @Inject
    lateinit var brokerSyncService: BrokerSyncService

    private val connectorIdOwn = "MDSL2222BB.CP69I8U"
    private val connectorFrontendUrlOwn = "https://testUrl"
    private val connectorEndpointUrlOwn = "https://testUrl/api/dsp"
    private val connectorManagementUrlOwn = "https://testUrl/api/management"
    private val connectorCertificateOwn = "testCertificate"
    private val clientIdOwn = "testClientId"

    private val connectorIdProvided = "MDSL2222BB.CP69I8T"
    private val connectorFrontendUrlProvided = "https://testUrl2"
    private val connectorEndpointUrlProvided = "https://testUrl2/api/dsp"
    private val connectorManagementUrlProvided = "https://testUrl2/api/management"
    private val connectorCertificateProvided = "testCertificate2"
    private val clientIdProvided = "testClientId2"

    private val connectorName = "testName"
    private val connectorLocation = "testLocation"
    private val userId = "00000000-0000-0000-0000-000000000001"
    private val mdsId = "MDSL1111AA"
    private val environment = "test"

    @BeforeEach
    fun setup() {
        connectorService.createOwnConnector(
            connectorId = connectorIdOwn,
            mdsId = mdsId,
            environment = environment,
            clientId = clientIdOwn,
            connector = CreateConnectorRequest(connectorName, connectorLocation, connectorFrontendUrlOwn, connectorEndpointUrlOwn, connectorManagementUrlOwn, connectorCertificateOwn),
            createdBy = userId
        )
        connectorService.createProvidedConnector(
            connectorId = connectorIdProvided,
            mdsId = mdsId,
            providerMdsId = "MDSL3333CC",
            environment = environment,
            clientId = clientIdProvided,
            connector = CreateConnectorRequest(connectorName, connectorLocation, connectorFrontendUrlProvided, connectorEndpointUrlProvided, connectorManagementUrlProvided, connectorCertificateProvided),
            createdBy = userId
        )
    }

    @Test
    fun repeatFailedRegistrationsTest() {
        // arrange
        val brokerClientService = mock(BrokerClientService::class.java)
        val brokerClient = mock(BrokerClient::class.java)
        QuarkusMock.installMockForType(brokerClientService, BrokerClientService::class.java)

        `when`(brokerClientService.forEnvironment(anyString())).thenReturn(brokerClient)

        val initialFailureCount = connectorService.getUnregisteredBrokerConnectors().size

        // act
        brokerSyncService.repeatFailedRegistrations()

        // assert
        assertThat(connectorService.getUnregisteredBrokerConnectors()).isEmpty()
        assertThat(initialFailureCount).isGreaterThan(0)
        verify(brokerClient).addConnectors(any())
    }
}
