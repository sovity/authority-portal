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

package de.sovity.authorityportal.web

import de.sovity.authorityportal.api.ReportingResource
import de.sovity.authorityportal.web.auth.AuthUtils
import de.sovity.authorityportal.web.auth.LoggedInUser
import de.sovity.authorityportal.web.services.reporting.ConnectorAuthorityCsvReportService
import de.sovity.authorityportal.web.services.reporting.ConnectorParticipantCsvReportService
import de.sovity.authorityportal.web.services.reporting.DataOfferCsvReportService
import de.sovity.authorityportal.web.services.reporting.SystemStabilityCsvReportService
import de.sovity.authorityportal.web.services.reporting.UserCsvReportService
import de.sovity.authorityportal.web.utils.TimeUtils
import jakarta.annotation.security.PermitAll
import jakarta.transaction.Transactional
import jakarta.ws.rs.core.HttpHeaders.CONTENT_DISPOSITION
import jakarta.ws.rs.core.Response
import java.io.ByteArrayInputStream
import java.time.format.DateTimeFormatter

@PermitAll
class ReportingResourceImpl(
    val authUtils: AuthUtils,
    val connectorAuthorityCsvReportService: ConnectorAuthorityCsvReportService,
    val connectorParticipantCsvReportService: ConnectorParticipantCsvReportService,
    val dataOfferCsvReportService: DataOfferCsvReportService,
    val systemStabilityCsvReportService: SystemStabilityCsvReportService,
    val userCsvReportService: UserCsvReportService,
    val loggedInUser: LoggedInUser,
    val timeUtils: TimeUtils
) : ReportingResource {

    @Transactional
    override fun createConnectorsCsvReport(environmentId: String): Response {
        authUtils.requiresAuthenticated()
        authUtils.requiresMemberOfAnyOrganization()

        val isAuthority = loggedInUser.roles
            .intersect(setOf(Roles.UserRoles.AUTHORITY_ADMIN, Roles.UserRoles.AUTHORITY_USER))
            .isNotEmpty()

        return if (isAuthority) {
            val csv = connectorAuthorityCsvReportService.generateAuthorityConnectorCsvReport(environmentId)
            val filename = "${localDate()}_connectors_$environmentId.csv"

            attachment(csv, filename)
        } else {
            val mdsId = loggedInUser.organizationMdsId!!

            val csv = connectorParticipantCsvReportService.generateParticipantConnectorCsvReport(mdsId, environmentId)
            val filename = "${localDate()}_connectors_${mdsId}_$environmentId.csv"

            attachment(csv, filename)
        }
    }

    @Transactional
    override fun createUsersAndRolesCsvReport(): Response {
        authUtils.requiresAuthenticated()
        authUtils.requiresAnyRole(Roles.UserRoles.AUTHORITY_ADMIN, Roles.UserRoles.AUTHORITY_USER)
        val csv = userCsvReportService.generateUserDetailsCsvReport()
        val filename = "${localDate()}_user_details.csv"
        return attachment(csv, filename)
    }

    @Transactional
    override fun createDataOffersCsvReport(environmentId: String): Response {
        authUtils.requiresAuthenticated()
        val csv = dataOfferCsvReportService.generateDataOffersCsvReport(environmentId)
        val filename = "${localDate()}_data_offers_$environmentId.csv"
        return attachment(csv, filename)
    }

    @Transactional
    override fun createSystemStabilityCsvReport(environmentId: String): Response {
        authUtils.requiresAuthenticated()
        val csv = systemStabilityCsvReportService.generateSystemStabilityCsvReport(environmentId)
        val filename = "${localDate()}_system_stability_$environmentId.csv"
        return attachment(csv, filename)
    }

    private fun attachment(csv: ByteArrayInputStream, filename: String) =
        Response
            .ok(csv)
            .header(CONTENT_DISPOSITION, "attachment; filename=$filename")
            .build()

    private fun localDate(): String? = DateTimeFormatter.ISO_LOCAL_DATE.format(timeUtils.now())
}
