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

import de.sovity.authorityportal.db.jooq.enums.ConnectorType
import de.sovity.authorityportal.web.environment.DeploymentEnvironmentService
import de.sovity.authorityportal.web.services.ConnectorService
import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.services.reporting.utils.ConnectorCsvReportUtils
import de.sovity.authorityportal.web.services.reporting.utils.CsvColumn
import de.sovity.authorityportal.web.services.reporting.utils.buildCsv
import de.sovity.authorityportal.web.thirdparty.broker.model.ConnectorOnlineStatus
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import java.io.ByteArrayInputStream

@ApplicationScoped
class ConnectorParticipantCsvReportService {

    @Inject
    lateinit var connectorService: ConnectorService

    @Inject
    lateinit var deploymentEnvironmentService: DeploymentEnvironmentService

    @Inject
    lateinit var organizationService: OrganizationService

    @Inject
    lateinit var connectorCsvReportUtils: ConnectorCsvReportUtils

    data class ParticipantConnectorReportRow(
        val connectorId: String,
        val connectorName: String,
        val connectorType: ConnectorType,
        val environment: String,
        val status: ConnectorOnlineStatus,
        val frontendUrl: String,
        val endpointUrl: String,
        val managementUrl: String,
        val hostedByMdsId: String?,
        val hostedByName: String?,
    )

    val columns = listOf<CsvColumn<ParticipantConnectorReportRow>>(
        CsvColumn("Connector ID") { it.connectorId },
        CsvColumn("Name") { it.connectorName },
        CsvColumn("Type") { it.connectorType.toString() },
        CsvColumn("Environment") { it.environment },
        CsvColumn("Status") { it.status.toString() },
        CsvColumn("Frontend URL") { it.frontendUrl },
        CsvColumn("Endpoint URL") { it.endpointUrl },
        CsvColumn("Management API URL") { it.managementUrl },
        CsvColumn("Hosted By MDS ID") { it.hostedByMdsId ?: "" },
        CsvColumn("Hosted By Name") { it.hostedByMdsId ?: "" }
    )

    fun generateParticipantConnectorCsvReport(mdsId: String, environmentId: String): ByteArrayInputStream {
        deploymentEnvironmentService.assertValidEnvId(environmentId)
        val rows = buildParticipantConnectorReportRows(mdsId, environmentId)
        return buildCsv(columns, rows)
    }

    private fun buildParticipantConnectorReportRows(mdsId: String, environmentId: String): List<ParticipantConnectorReportRow> {
        val connectors = connectorService.getConnectorsByMdsIdAndEnvironment(mdsId, environmentId)
        val organizationNames = organizationService.getAllOrganizationNames()
        val connectorStatuses = connectorCsvReportUtils.getConnectorStatusesFromBroker(environmentId, connectors)

        return connectors.map {
            ParticipantConnectorReportRow(
                connectorId = it.connectorId,
                connectorName = it.name,
                connectorType = it.type,
                environment = it.environment,
                status = connectorStatuses[it.endpointUrl] ?: ConnectorOnlineStatus.DEAD,
                frontendUrl = it.frontendUrl,
                endpointUrl = it.endpointUrl,
                managementUrl = it.managementUrl,
                hostedByMdsId = it.providerMdsId,
                hostedByName = organizationNames[it.providerMdsId]
            )
        }
    }

}
