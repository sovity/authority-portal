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
import de.sovity.authorityportal.web.services.reporting.utils.CsvColumn
import de.sovity.authorityportal.web.services.reporting.utils.buildCsv
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import java.io.ByteArrayInputStream

@ApplicationScoped
class ConnectorAuthorityCsvReportService {

    @Inject
    lateinit var connectorService: ConnectorService

    @Inject
    lateinit var organizationService: OrganizationService

    @Inject
    lateinit var deploymentEnvironmentService: DeploymentEnvironmentService

    @Inject
    lateinit var keycloakService: KeycloakService

    data class AuthorityConnectorReportRow(
        val organizationMdsId: String,
        val organizationName: String,
        val connectorId: String,
        val connectorName: String,
        val connectorType: ConnectorType,
        val environment: String,
        val frontendUrl: String,
        val endpointUrl: String,
        val managementUrl: String,
        val hostedByMdsId: String?,
        val hostedByName: String?,
    )

    val columns = listOf<CsvColumn<AuthorityConnectorReportRow>>(
        CsvColumn("Organization MDS ID") { it.organizationMdsId },
        CsvColumn("Organization Name") { it.organizationName },
        CsvColumn("Connector ID") { it.connectorId },
        CsvColumn("Name") { it.connectorName },
        CsvColumn("Type") { it.connectorType.toString() },
        CsvColumn("Environment") { it.environment },
        CsvColumn("Frontend URL") { it.frontendUrl },
        CsvColumn("Endpoint URL") { it.endpointUrl },
        CsvColumn("Management API URL") { it.managementUrl },
        CsvColumn("Hosted By MDS ID") { it.hostedByMdsId ?: "" },
        CsvColumn("Hosted By Name") { it.hostedByMdsId ?: "" },
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
                organizationMdsId = it.mdsId,
                organizationName = organizationNames[it.mdsId] ?: "",
                connectorId = it.connectorId,
                connectorName = it.name,
                connectorType = it.type,
                environment = it.environment,
                frontendUrl = it.frontendUrl,
                endpointUrl = it.endpointUrl,
                managementUrl = it.managementUrl,
                hostedByMdsId = it.providerMdsId,
                hostedByName = organizationNames[it.providerMdsId]
            )
        }
    }

}
