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

import de.sovity.authorityportal.api.model.ConnectorStatusDto
import de.sovity.authorityportal.db.jooq.enums.ConnectorType
import de.sovity.authorityportal.web.environment.DeploymentEnvironmentService
import de.sovity.authorityportal.web.pages.connectormanagement.toDto
import de.sovity.authorityportal.web.services.ConnectorService
import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.services.reporting.utils.CsvColumn
import de.sovity.authorityportal.web.services.reporting.utils.buildCsv
import jakarta.enterprise.context.ApplicationScoped
import java.io.ByteArrayInputStream

@ApplicationScoped
class ConnectorParticipantCsvReportService(
    val connectorService: ConnectorService,
    val deploymentEnvironmentService: DeploymentEnvironmentService,
    val organizationService: OrganizationService,
) {

    data class ParticipantConnectorReportRow(
        val connectorId: String,
        val connectorName: String,
        val connectorType: ConnectorType,
        val environment: String,
        val status: ConnectorStatusDto,
        val frontendUrl: String,
        val endpointUrl: String,
        val managementUrl: String,
        val hostedByOrganizationId: String?,
        val hostedByOrganizationName: String?,
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
        CsvColumn("Hosted By Organization ID") { it.hostedByOrganizationId ?: "" },
        CsvColumn("Hosted By Name") { it.hostedByOrganizationId ?: "" }
    )

    fun generateParticipantConnectorCsvReport(organizationId: String, environmentId: String): ByteArrayInputStream {
        deploymentEnvironmentService.assertValidEnvId(environmentId)
        val rows = buildParticipantConnectorReportRows(organizationId, environmentId)
        return buildCsv(columns, rows)
    }

    private fun buildParticipantConnectorReportRows(
        organizationId: String,
        environmentId: String
    ): List<ParticipantConnectorReportRow> {
        val connectors = connectorService.getConnectorsByOrganizationIdAndEnvironment(organizationId, environmentId)
        val organizationNames = organizationService.getAllOrganizationNames()

        return connectors.map {
            ParticipantConnectorReportRow(
                connectorId = it.connectorId,
                connectorName = it.name,
                connectorType = it.type,
                environment = it.environment,
                status = it.onlineStatus.toDto(),
                frontendUrl = it.frontendUrl,
                endpointUrl = it.endpointUrl,
                managementUrl = it.managementUrl,
                hostedByOrganizationId = it.providerOrganizationId,
                hostedByOrganizationName = organizationNames[it.providerOrganizationId]
            )
        }
    }

}
