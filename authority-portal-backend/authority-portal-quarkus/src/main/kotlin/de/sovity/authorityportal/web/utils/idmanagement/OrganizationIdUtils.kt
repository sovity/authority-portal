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
import org.eclipse.microprofile.config.inject.ConfigProperty
import org.jooq.DSLContext

@ApplicationScoped
class OrganizationIdUtils(
    val dsl: DSLContext,
    val idUtils: IdUtils,
    @ConfigProperty(
        name = "authority-portal.organization.id.prefix",
        defaultValue = "BPN"
    ) val organizationIdPrefix: String,
    @ConfigProperty(
        name = "authority-portal.organization.id.length",
        defaultValue = "4"
    ) val organizationIdLength: Int
) {

    fun generateOrganizationId(): String {
        val usedOrganizationIds = getUsedOrganizationIds()
        var organizationId: String

        do {
            organizationId = getOrganizationIdCandidate(organizationIdPrefix, organizationIdLength)
        } while (usedOrganizationIds.contains(organizationId))

        return organizationId
    }

    private fun getOrganizationIdCandidate(prefix: String, identifierLength: Int): String {
        val identifier = idUtils.randomIdentifier(identifierLength)
        val checksum = idUtils.calculateVerificationDigits(identifier)
        return "${prefix}L$identifier$checksum"
    }

    private fun getUsedOrganizationIds(): Set<String> {
        val o = Tables.ORGANIZATION
        return dsl.select(o.ID)
            .from(o)
            .fetchSet(o.ID)
    }
}
