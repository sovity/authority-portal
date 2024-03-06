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

package de.sovity.authorityportal.web.pages.organizationmanagement

import de.sovity.authorityportal.api.model.MemberInfo
import de.sovity.authorityportal.db.jooq.enums.OrganizationRegistrationStatus
import de.sovity.authorityportal.db.jooq.tables.records.OrganizationRecord
import de.sovity.authorityportal.web.environment.DeploymentEnvironmentService
import de.sovity.authorityportal.web.services.ConnectorMetadataService
import de.sovity.authorityportal.web.services.ConnectorService
import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.services.UserDetail
import de.sovity.authorityportal.web.services.UserDetailService
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito.anyString
import org.mockito.Mockito.mock
import org.mockito.Mockito.`when`
import org.mockito.junit.jupiter.MockitoExtension

@ExtendWith(MockitoExtension::class)
class OrganizationInfoApiServiceTest {

    @InjectMocks
    lateinit var organizationInfoApiService: OrganizationInfoApiService

    @Mock
    lateinit var userDetailService: UserDetailService

    @Mock
    lateinit var connectorService: ConnectorService

    @Mock
    lateinit var organizationService: OrganizationService

    @Mock
    lateinit var connectorMetadataService: ConnectorMetadataService

    @Mock
    lateinit var deploymentEnvironmentService: DeploymentEnvironmentService

    private val mdsId = "testMdsId"
    private val environmentId = "testEnvironmentId"
    private val organizationRecord: OrganizationRecord = mock(OrganizationRecord::class.java)
    private val memberInfos = listOf(mock(MemberInfo::class.java))
    private val connectorCount = 5
    private val dataOfferCount = 14

    @BeforeEach
    fun before() {
        `when`(organizationRecord.registrationStatus).thenReturn(OrganizationRegistrationStatus.ACTIVE)
        `when`(organizationRecord.createdBy).thenReturn("testCreatedBy")
        `when`(organizationService.getOrganizationOrThrow(mdsId)).thenReturn(organizationRecord)
        `when`(userDetailService.getOrganizationMembers(mdsId)).thenReturn(memberInfos)
        `when`(userDetailService.getUserData(anyString())).thenReturn(mock(UserDetail::class.java))
    }

    @Test
    fun testOrganizationDetails() {
        // arrange
        `when`(deploymentEnvironmentService.assertValidEnvId(environmentId)).then {}
        `when`(connectorService.getConnectorCountByMdsIdAndEnvironment(mdsId, environmentId)).thenReturn(connectorCount)
        `when`(connectorMetadataService.getTotalDataOffersByMdsId(mdsId, environmentId)).thenReturn(dataOfferCount)

        // act
        val result = organizationInfoApiService.getOrganizationInformation(mdsId, environmentId)

        // assert
        assertEquals(OrganizationRegistrationStatus.ACTIVE.toDto(), result.registrationStatus)
        assertEquals(memberInfos, result.memberList)
        assertEquals(memberInfos.size, result.memberCount)
        assertEquals(connectorCount, result.connectorCount)
        assertEquals(dataOfferCount, result.dataOfferCount)
    }

    @Test
    fun testOwnOrganizationDetails() {
        // act
        val result = organizationInfoApiService.getOwnOrganizationInformation(mdsId)

        // assert
        assertEquals(OrganizationRegistrationStatus.ACTIVE.toDto(), result.registrationStatus)
        assertEquals(memberInfos, result.memberList)
    }
}
