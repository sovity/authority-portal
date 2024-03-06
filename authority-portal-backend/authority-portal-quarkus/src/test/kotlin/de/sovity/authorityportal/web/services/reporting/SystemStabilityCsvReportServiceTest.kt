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
package de.sovity.authorityportal.web.services.reporting

import de.sovity.authorityportal.db.jooq.enums.ComponentOnlineStatus
import de.sovity.authorityportal.db.jooq.enums.ComponentType
import de.sovity.authorityportal.db.jooq.tables.records.ComponentDowntimesRecord
import de.sovity.authorityportal.web.services.ComponentStatusService
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito.`when`
import org.mockito.junit.jupiter.MockitoExtension
import java.time.Duration
import java.time.OffsetDateTime

@ExtendWith(MockitoExtension::class)
class SystemStabilityCsvReportServiceTest {

    @InjectMocks
    lateinit var systemStabilityCsvReportService: SystemStabilityCsvReportService

    @Mock
    lateinit var componentStatusService: ComponentStatusService

    private val envId = "test"

    private val day0 = OffsetDateTime.now()

    @Test
    fun testRowGeneration() {
        // arrange
        val records = listOf(
            record(0, ComponentType.BROKER, ComponentOnlineStatus.DOWN),
            record(0, ComponentType.DAPS, ComponentOnlineStatus.UP),
            record(1, ComponentType.DAPS, ComponentOnlineStatus.DOWN),
            record(2, ComponentType.BROKER, ComponentOnlineStatus.UP),
            record(3, ComponentType.BROKER, ComponentOnlineStatus.DOWN),
            record(4, ComponentType.BROKER, ComponentOnlineStatus.UP),
        )
        `when`(componentStatusService.getUpOrDownRecordsOrderByTimestampAsc(envId)).thenReturn(records)

        // act
        val rows = systemStabilityCsvReportService.buildSystemStabilityReportRows(envId)

        // assert
        assertThat(rows).hasSize(3)
        val first = rows[2] // reversed order
        assertThat(first.component).isEqualTo(ComponentType.BROKER)
        assertThat(first.environment).isEqualTo(envId)
        assertThat(first.beginDowntime).isEqualTo(day(0))
        assertThat(first.endDowntime).isEqualTo(day(2))
        assertThat(first.duration).isEqualTo(Duration.ofDays(2))

        val second = rows[1] // reversed order
        assertThat(second.component).isEqualTo(ComponentType.DAPS)
        assertThat(second.environment).isEqualTo(envId)
        assertThat(second.beginDowntime).isEqualTo(day(1))
        assertThat(second.endDowntime).isNull()
        assertThat(second.duration).isNull()

        val third = rows[0] // reversed order
        assertThat(third.component).isEqualTo(ComponentType.BROKER)
        assertThat(third.environment).isEqualTo(envId)
        assertThat(third.beginDowntime).isEqualTo(day(3))
        assertThat(third.endDowntime).isEqualTo(day(4))
        assertThat(third.duration).isEqualTo(Duration.ofDays(1))
    }

    fun record(day: Int, component: ComponentType, status: ComponentOnlineStatus) = ComponentDowntimesRecord().also {
        it.environment = envId
        it.timeStamp = day(day)
        it.component = component
        it.status = status
    }

    private fun day(day: Int): OffsetDateTime? = day0.plusDays(day.toLong())
}
