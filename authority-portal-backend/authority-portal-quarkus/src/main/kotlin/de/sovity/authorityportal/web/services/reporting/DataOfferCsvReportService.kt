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

import de.sovity.authorityportal.web.services.ConnectorService
import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.services.dataoffer.DataOfferQuery
import de.sovity.authorityportal.web.services.reporting.utils.CsvColumn
import de.sovity.authorityportal.web.services.reporting.utils.buildCsv
import jakarta.enterprise.context.ApplicationScoped
import java.io.ByteArrayInputStream

@ApplicationScoped
class DataOfferCsvReportService(
    val connectorService: ConnectorService,
    val organizationService: OrganizationService,
    val dataOfferQuery: DataOfferQuery
) {

    data class DataOfferReportRow(
        val dataOfferId: String,
        val dataOfferName: String,
        val organizationId: String,
        val organizationName: String,
        val status: String,
        val dataSourceAvailability: String
    )

    val columns = listOf<CsvColumn<DataOfferReportRow>>(
        CsvColumn("Data Offer ID") { it.dataOfferId },
        CsvColumn("Data Offer Name") { it.dataOfferName },
        CsvColumn("Organization ID") { it.organizationId },
        CsvColumn("Organization Name") { it.organizationName },
        CsvColumn("Status") { it.status },
        CsvColumn("Data Source Type") { it.dataSourceAvailability }
    )

    fun generateDataOffersCsvReport(environmentId: String): ByteArrayInputStream {
        val rows = buildDataOfferReportRows(environmentId)
        return buildCsv(columns, rows)
    }

    private fun buildDataOfferReportRows(environmentId: String): List<DataOfferReportRow> {
        val connectorEndpoints = connectorService.getConnectorsByEnvironment(environmentId).map { it.endpointUrl }
        val organizationNames = organizationService.getAllOrganizationNames()
        val dataOffers = dataOfferQuery.getDataOffersForConnectorIdsAndEnvironment(environmentId, connectorEndpoints)

        return dataOffers.map {
            DataOfferReportRow(
                dataOfferId = it.dataOfferId,
                dataOfferName = it.dataOfferName,
                organizationId = it.organizationId,
                organizationName = organizationNames[it.organizationId] ?: "",
                status = it.onlineStatus.toString(),
                dataSourceAvailability = it.dataSourceAvailability
            )
        }
    }
}
