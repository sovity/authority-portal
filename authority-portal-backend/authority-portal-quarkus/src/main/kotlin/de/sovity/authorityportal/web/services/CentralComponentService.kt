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
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.jooq.DSLContext
import java.time.OffsetDateTime

@ApplicationScoped
class CentralComponentService {

    @Inject
    lateinit var dsl: DSLContext

    fun getCentralComponentOrThrow(centralComponentId: String): ComponentRecord {
        return getComponent(centralComponentId) ?: error("Component with id $centralComponentId not found")
    }

    fun getCentralComponentsByEnvironment(envId: String): List<ComponentRecord> {
        val c = Tables.COMPONENT

        return dsl.selectFrom(c)
            .where(c.ENVIRONMENT.eq(envId))
            .fetch()
    }

    fun getCentralComponentsByMdsId(mdsId: String): List<ComponentRecord> {
        val c = Tables.COMPONENT

        return dsl.selectFrom(c)
            .where(c.MDS_ID.eq(mdsId))
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
        mdsId: String,
        environment: String,
        clientId: String,
        centralComponentCreateRequest: CentralComponentCreateRequest,
        createdBy: String
    ) {
        dsl.newRecord(Tables.COMPONENT).also {
            it.id = centralComponentId
            it.mdsId = mdsId
            it.environment = environment
            it.clientId = clientId
            it.name = centralComponentCreateRequest.name.trim()
            it.homepageUrl = centralComponentCreateRequest.homepageUrl?.trim()
            it.endpointUrl = centralComponentCreateRequest.endpointUrl.trim()
            it.createdBy = createdBy
            it.createdAt = OffsetDateTime.now()

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
