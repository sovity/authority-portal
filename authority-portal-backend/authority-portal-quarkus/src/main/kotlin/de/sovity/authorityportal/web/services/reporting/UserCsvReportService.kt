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

import de.sovity.authorityportal.api.model.UserRoleDto
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.web.pages.usermanagement.UserRoleMapper
import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.services.UserDetailService
import de.sovity.authorityportal.web.services.reporting.utils.CsvColumn
import de.sovity.authorityportal.web.services.reporting.utils.buildCsv
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import java.io.ByteArrayInputStream

@ApplicationScoped
class UserCsvReportService {

    @Inject
    lateinit var userDetailService: UserDetailService

    @Inject
    lateinit var userRoleMapper: UserRoleMapper

    @Inject
    lateinit var organizationService: OrganizationService

    data class UserReportRow(
        val userId: String,
        val organizationMdsId: String?,
        val organizationName: String?,
        val firstName: String,
        val lastName: String,
        val roles: Set<UserRoleDto>,
        val email: String,
        val position: String?,
        val registrationStatus: UserRegistrationStatus
    )

    val columns = listOf<CsvColumn<UserReportRow>>(
        CsvColumn("User ID") { it.userId },
        CsvColumn("Organization MDS ID") { it.organizationMdsId ?: "" },
        CsvColumn("Organization Name") { it.organizationName ?: "" },
        CsvColumn("First Name") { it.firstName },
        CsvColumn("Last Name") { it.lastName },
        CsvColumn("Roles") { it.roles.toString() },
        CsvColumn("Email") { it.email },
        CsvColumn("Job Title") { it.position ?: "" },
        CsvColumn("Registration Status") { it.registrationStatus.toString() }
    )

    fun generateUserDetailsCsvReport(): ByteArrayInputStream {
        val rows = buildUserReportRows()
        return buildCsv(columns, rows)
    }

    private fun buildUserReportRows(): List<UserReportRow> {
        val userDetails = userDetailService.getAllUserDetails()
        val organizationNames = organizationService.getAllOrganizationNames()

        return userDetails.map {
            UserReportRow(
                userId = it.userId,
                organizationMdsId = it.organizationMdsId,
                organizationName = organizationNames[it.organizationMdsId],
                firstName = it.firstName,
                lastName = it.lastName,
                roles = userRoleMapper.getUserRoles(it.roles),
                email = it.email,
                position = it.position,
                registrationStatus = it.registrationStatus
            )
        }
    }
}
