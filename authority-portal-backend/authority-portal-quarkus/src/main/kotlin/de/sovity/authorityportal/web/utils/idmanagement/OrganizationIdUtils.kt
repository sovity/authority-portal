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

package de.sovity.authorityportal.web.utils.idmanagement

import de.sovity.authorityportal.db.jooq.Tables
import jakarta.enterprise.context.ApplicationScoped
import org.jooq.DSLContext

@ApplicationScoped
class OrganizationIdUtils(
    val dsl: DSLContext,
    val idUtils: IdUtils,
) {

    companion object {
        const val MDS_ID_LENGTH = 4
    }


    fun generateOrganizationId(): String {
        val usedOrganizationIds = getUsedOrganizationIds()
        var organizationId: String

        do {
            organizationId = getOrganizationIdCandidate()
        } while (usedOrganizationIds.contains(organizationId))

        return organizationId
    }

    private fun getOrganizationIdCandidate(): String {
        val prefix = "MDSL"
        val identifier = idUtils.randomIdentifier(MDS_ID_LENGTH)
        val checksum = idUtils.calculateVerificationDigits(identifier)
        return "$prefix$identifier$checksum"
    }

    private fun getUsedOrganizationIds(): Set<String> {
        val o = Tables.ORGANIZATION
        return dsl.select(o.ID)
            .from(o)
            .fetchSet(o.ID)
    }
}
