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

package de.sovity.authorityportal.web.integration.pages.componentmanagement

import de.sovity.authorityportal.api.model.CentralComponentCreateRequest
import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.tables.records.ComponentRecord
import de.sovity.authorityportal.web.pages.centralcomponentmanagement.CentralComponentManagementApiService
import de.sovity.authorityportal.web.services.CentralComponentService
import de.sovity.authorityportal.web.thirdparty.daps.DapsClient
import de.sovity.authorityportal.web.thirdparty.daps.DapsClientService
import de.sovity.authorityportal.web.utils.idmanagement.ClientIdUtils
import io.quarkus.test.junit.QuarkusMock
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.mockito.Mockito.`when`
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.eq
import org.mockito.kotlin.verify

@QuarkusTest
@ExtendWith(MockitoExtension::class)
class CentralComponentManagementApiServiceTest {
    @Inject
    lateinit var centralComponentManagementApiService: CentralComponentManagementApiService

    @Inject
    lateinit var centralComponentService: CentralComponentService

    private val testClientId = "testClientId"
    private val testCertificate = "testCertificate"
    private val testComponentName = "testComponent"
    private val testComponentUrl = "https://xample.com/broker"
    private val testComponentEndpointUrl = "https://xample.com/broker/endpoint"

    private val userId = "00000000-0000-0000-0000-000000000001"
    private val mdsId = "MDSL1111AA"
    private val envId = "test"

    val centralComponentCreateRequest = CentralComponentCreateRequest(
        testComponentName, testComponentUrl, testComponentEndpointUrl, testCertificate
    )

    val clientIdUtilsMock = mock(ClientIdUtils::class.java)
    val dapsClient = mock(DapsClient::class.java)
    val dapsClientService = mock(DapsClientService::class.java)

    @BeforeEach
    fun init() {
        doReturn(testClientId).`when`(clientIdUtilsMock).generateFromCertificate(testCertificate)
        `when`(dapsClientService.forEnvironment(eq(envId))).thenReturn(dapsClient)

        QuarkusMock.installMockForType(clientIdUtilsMock, ClientIdUtils::class.java)
        QuarkusMock.installMockForType(dapsClientService, DapsClientService::class.java)

        centralComponentService.dsl
            .deleteFrom(Tables.COMPONENT)
            .where(Tables.COMPONENT.CLIENT_ID.eq(testClientId))
            .execute()
    }

    @Test
    fun testRegisterCentralComponent() {
        // act
        val response = centralComponentManagementApiService.registerCentralComponent(
            centralComponentCreateRequest, userId, mdsId, envId
        )

        // assert
        verify(clientIdUtilsMock).generateFromCertificate(eq(testCertificate))
        verify(dapsClientService).forEnvironment(eq(envId))
        assertComponent(response.id)
    }

    @Test
    fun listCentralComponentsTest() {
        // arrange
        centralComponentManagementApiService.registerCentralComponent(centralComponentCreateRequest, userId, mdsId, envId)

        // act
        val response = centralComponentManagementApiService.listCentralComponents(envId)

        // assert
        assertThat(response).hasSize(1)
        assertComponent(response[0].centralComponentId)
    }

    @Test
    fun deleteCentralComponent() {
        // arrange
        centralComponentManagementApiService.registerCentralComponent(centralComponentCreateRequest, userId, mdsId, envId)
        val componentList = centralComponentManagementApiService.listCentralComponents(envId)

        // act
        centralComponentManagementApiService.deleteCentralComponentByUser(componentList[0].centralComponentId, userId)
        val result = centralComponentManagementApiService.listCentralComponents(envId)

        // assert
        assertThat(result).hasSize(0)

    }

    private fun assertComponent(componentId: String) {
        val centralComponent: ComponentRecord = centralComponentService.getCentralComponentOrThrow(componentId)
        assertThat(componentId).isNotNull()
        assertThat(centralComponent).isNotNull()
        assertThat(centralComponent.mdsId).isEqualTo(mdsId)
        assertThat(centralComponent.environment).isEqualTo(envId)
        assertThat(centralComponent.clientId).isEqualTo(testClientId)
        assertThat(centralComponent.name).isEqualTo(testComponentName)
        assertThat(centralComponent.homepageUrl).isEqualTo(testComponentUrl)
        assertThat(centralComponent.endpointUrl).isEqualTo(testComponentEndpointUrl)
        assertThat(centralComponent.createdBy).isEqualTo(userId)
    }
}
