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
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import jakarta.enterprise.context.ApplicationScoped
import java.io.ByteArrayInputStream

@ApplicationScoped
class ConnectorAuthorityCsvReportService(
    val connectorService: ConnectorService,
    val organizationService: OrganizationService,
    val deploymentEnvironmentService: DeploymentEnvironmentService,
    val keycloakService: KeycloakService,
) {

    data class AuthorityConnectorReportRow(
        val organizationId: String,
        val organizationName: String,
        val connectorId: String,
        val connectorName: String,
        val connectorType: ConnectorType,
        val environment: String,
        val status: ConnectorStatusDto,
        val frontendUrl: String?,
        val endpointUrl: String?,
        val managementUrl: String?,
        val hostedByOrganizationId: String?,
        val hostedByName: String?,
    )

    val columns = listOf<CsvColumn<AuthorityConnectorReportRow>>(
        CsvColumn("Organization ID") { it.organizationId },
        CsvColumn("Organization Name") { it.organizationName },
        CsvColumn("Connector ID") { it.connectorId },
        CsvColumn("Name") { it.connectorName },
        CsvColumn("Type") { it.connectorType.toString() },
        CsvColumn("Environment") { it.environment },
        CsvColumn("Status") { it.status.toString() },
        CsvColumn("Frontend URL") { it.frontendUrl ?: "" },
        CsvColumn("Endpoint URL") { it.endpointUrl ?: "" },
        CsvColumn("Management API URL") { it.managementUrl ?: "" },
        CsvColumn("Hosted By Organization ID") { it.hostedByOrganizationId ?: "" },
        CsvColumn("Hosted By Name") { it.hostedByName ?: "" },
    )

    fun generateAuthorityConnectorCsvReport(environmentId: String): ByteArrayInputStream {
        deploymentEnvironmentService.assertValidEnvId(environmentId)
        val rows = buildAuthorityConnectorReportRows(environmentId)
        return buildCsv(columns, rows)
    }

    private fun buildAuthorityConnectorReportRows(environmentId: String): List<AuthorityConnectorReportRow> {
        val connectors = connectorService.getConnectorsByEnvironment(environmentId)
        val organizationNames = organizationService.getAllOrganizationNames()

        return connectors.map {
            AuthorityConnectorReportRow(
                organizationId = it.organizationId,
                organizationName = organizationNames[it.organizationId] ?: "",
                connectorId = it.connectorId,
                connectorName = it.name,
                connectorType = it.type,
                environment = it.environment,
                status = it.onlineStatus.toDto(),
                frontendUrl = it.frontendUrl,
                endpointUrl = it.endpointUrl,
                managementUrl = it.managementUrl,
                hostedByOrganizationId = it.providerOrganizationId,
                hostedByName = organizationNames[it.providerOrganizationId]
            )
        }
    }
}
