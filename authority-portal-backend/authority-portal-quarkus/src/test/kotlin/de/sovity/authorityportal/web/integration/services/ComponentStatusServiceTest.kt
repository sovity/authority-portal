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
package de.sovity.authorityportal.web.integration.services

import de.sovity.authorityportal.db.jooq.enums.ComponentOnlineStatus
import de.sovity.authorityportal.db.jooq.enums.ComponentType
import de.sovity.authorityportal.web.environment.DeploymentEnvironmentConfiguration.DeploymentEnvironment
import de.sovity.authorityportal.web.environment.DeploymentEnvironmentConfiguration.DeploymentEnvironment.BrokerConfig
import de.sovity.authorityportal.web.environment.DeploymentEnvironmentConfiguration.DeploymentEnvironment.DapsConfig
import de.sovity.authorityportal.web.environment.DeploymentEnvironmentConfiguration.DeploymentEnvironment.LoggingHouseConfig
import de.sovity.authorityportal.web.environment.DeploymentEnvironmentService
import de.sovity.authorityportal.web.services.ComponentStatusService
import de.sovity.authorityportal.web.thirdparty.uptimekuma.UptimeKumaClientResource
import io.quarkus.test.TestTransaction
import io.quarkus.test.junit.QuarkusMock
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import org.mockito.Mockito.anyString
import org.mockito.Mockito.`when`
import java.time.OffsetDateTime

@QuarkusTest
class ComponentStatusServiceTest {

    @Inject
    lateinit var componentStatusService: ComponentStatusService

    lateinit var uptimeKumaClientResource: UptimeKumaClientResource

    lateinit var deploymentEnvironmentService: DeploymentEnvironmentService

    private val envId = "test"

    @BeforeEach
    fun setup() {
        uptimeKumaClientResource = Mockito.mock(UptimeKumaClientResource::class.java)
        QuarkusMock.installMockForType(uptimeKumaClientResource, UptimeKumaClientResource::class.java)

        // Deployment Environment
        deploymentEnvironmentService = Mockito.mock(DeploymentEnvironmentService::class.java)
        QuarkusMock.installMockForType(deploymentEnvironmentService, DeploymentEnvironmentService::class.java)

        val testEnv = Mockito.mock(DeploymentEnvironment::class.java)
        val dapsConf = Mockito.mock(DapsConfig::class.java)
        val brokerConf = Mockito.mock(BrokerConfig::class.java)
        val lhConf = Mockito.mock(LoggingHouseConfig::class.java)
        `when`(testEnv.daps()).thenReturn(dapsConf)
        `when`(dapsConf.kumaName()).thenReturn("TEST mds daps")
        `when`(testEnv.broker()).thenReturn(brokerConf)
        `when`(brokerConf.kumaName()).thenReturn("TEST mds catalog")
        `when`(testEnv.loggingHouse()).thenReturn(lhConf)
        `when`(lhConf.kumaName()).thenReturn("TEST mds logging house")

        `when`(deploymentEnvironmentService.findAll()).thenReturn(
            mapOf(envId to testEnv)
        )
    }

    @Test
    @TestTransaction
    fun fetchComponentStatusesTest() {
        // arrange
        val response1 = """
            monitor_status{monitor_name="TEST mds daps",monitor_type="http",monitor_url="https://some.url",monitor_hostname="null",monitor_port="null"} 1
            monitor_status{monitor_name="TEST mds catalog",monitor_type="http",monitor_url="https://some.url",monitor_hostname="null",monitor_port="null"} 0
            monitor_status{monitor_name="TEST mds logging house",monitor_type="http",monitor_url="https://some.url",monitor_hostname="null",monitor_port="null"} 2
            monitor_status{monitor_name="DEV mds daps",monitor_type="http",monitor_url="https://some.url",monitor_hostname="null",monitor_port="null"} 3
        """.trimIndent()
        val response2 = """
            monitor_status{monitor_name="TEST mds daps",monitor_type="http",monitor_url="https://some.url",monitor_hostname="null",monitor_port="null"} 0
            monitor_status{monitor_name="TEST mds catalog",monitor_type="http",monitor_url="https://some.url",monitor_hostname="null",monitor_port="null"} 1
            monitor_status{monitor_name="TEST mds logging house",monitor_type="http",monitor_url="https://some.url",monitor_hostname="null",monitor_port="null"} 2
            monitor_status{monitor_name="DEV mds daps",monitor_type="http",monitor_url="https://some.url",monitor_hostname="null",monitor_port="null"} 1
        """.trimIndent()
        `when`(uptimeKumaClientResource.getMetrics(anyString())).thenReturn(response1, response2)

        // act
        componentStatusService.fetchComponentStatuses()
        componentStatusService.fetchComponentStatuses()

        // assert
        val brokerHistory = componentStatusService.getStatusHistoryAscSince(
            ComponentType.BROKER,
            OffsetDateTime.now().minusDays(1),
            envId
        )
        val dapsHistory = componentStatusService.getStatusHistoryAscSince(
            ComponentType.DAPS,
            OffsetDateTime.now().minusDays(1),
            envId
        )
        val lhHistory = componentStatusService.getStatusHistoryAscSince(
            ComponentType.LOGGING_HOUSE,
            OffsetDateTime.now().minusDays(1),
            envId
        )
        assertThat(brokerHistory).hasSize(2)
        assertThat(brokerHistory[0].status).isEqualTo(ComponentOnlineStatus.DOWN)
        assertThat(brokerHistory[1].status).isEqualTo(ComponentOnlineStatus.UP)
        assertThat(brokerHistory[0].timeStamp).isBefore(brokerHistory[1].timeStamp)
        assertThat(dapsHistory).hasSize(2)
        assertThat(dapsHistory[0].status).isEqualTo(ComponentOnlineStatus.UP)
        assertThat(dapsHistory[1].status).isEqualTo(ComponentOnlineStatus.DOWN)
        assertThat(dapsHistory[0].timeStamp).isBefore(brokerHistory[1].timeStamp)
        assertThat(lhHistory).hasSize(1)
        assertThat(lhHistory[0].status).isEqualTo(ComponentOnlineStatus.PENDING)
    }
}
