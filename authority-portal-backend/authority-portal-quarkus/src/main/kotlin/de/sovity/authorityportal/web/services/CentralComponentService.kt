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

package de.sovity.authorityportal.web.services

import de.sovity.authorityportal.api.model.CentralComponentCreateRequest
import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.tables.records.ComponentRecord
import de.sovity.authorityportal.web.utils.TimeUtils
import jakarta.enterprise.context.ApplicationScoped
import org.jooq.DSLContext

@ApplicationScoped
class CentralComponentService(
    val dsl: DSLContext,
    val timeUtils: TimeUtils
) {

    fun getCentralComponentOrThrow(centralComponentId: String): ComponentRecord {
        return getComponent(centralComponentId) ?: error("Component with id $centralComponentId not found")
    }

    fun getCentralComponentsByEnvironment(envId: String): List<ComponentRecord> {
        val c = Tables.COMPONENT

        return dsl.selectFrom(c)
            .where(c.ENVIRONMENT.eq(envId))
            .fetch()
    }

    fun getCentralComponentsByOrganizationId(organizationId: String): List<ComponentRecord> {
        val c = Tables.COMPONENT

        return dsl.selectFrom(c)
            .where(c.ORGANIZATION_ID.eq(organizationId))
            .fetch()
    }

    private fun getComponent(centralComponentId: String): ComponentRecord? {
        val c = Tables.COMPONENT

        return dsl.selectFrom(c)
            .where(c.ID.eq(centralComponentId))
            .fetchOne()
    }

    fun createCentralComponent(
        centralComponentId: String,
        organizationId: String,
        environment: String,
        clientId: String,
        centralComponentCreateRequest: CentralComponentCreateRequest,
        createdBy: String
    ) {
        dsl.newRecord(Tables.COMPONENT).also {
            it.id = centralComponentId
            it.organizationId = organizationId
            it.environment = environment
            it.clientId = clientId
            it.name = centralComponentCreateRequest.name.trim()
            it.homepageUrl = centralComponentCreateRequest.homepageUrl?.trim()
            it.endpointUrl = centralComponentCreateRequest.endpointUrl.trim()
            it.createdBy = createdBy
            it.createdAt = timeUtils.now()

            it.insert()
        }
    }

    fun deleteCentralComponent(centralComponentId: String) {
        val c = Tables.COMPONENT

        dsl.deleteFrom(c)
            .where(c.ID.eq(centralComponentId))
            .execute()
    }

    fun updateCentralComponentsCreator(newCreatedBy: String, oldCreatedBy: String) {
        val c = Tables.COMPONENT
        dsl.update(c)
            .set(c.CREATED_BY, newCreatedBy)
            .where(c.CREATED_BY.eq(oldCreatedBy))
            .execute()
    }
}
