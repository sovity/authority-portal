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

import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.enums.ComponentOnlineStatus
import de.sovity.authorityportal.db.jooq.enums.ComponentType
import de.sovity.authorityportal.db.jooq.tables.records.ComponentDowntimesRecord
import de.sovity.authorityportal.web.thirdparty.uptimekuma.UptimeKumaClient
import de.sovity.authorityportal.web.thirdparty.uptimekuma.model.toDb
import io.quarkus.logging.Log
import io.quarkus.scheduler.Scheduled
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.jooq.DSLContext
import org.jooq.impl.DSL
import java.time.OffsetDateTime

@ApplicationScoped
class ComponentStatusService {

    @Inject
    lateinit var dsl: DSLContext

    @Inject
    lateinit var uptimeKumaClient: UptimeKumaClient

    @Scheduled(every = "30s")
    fun fetchComponentStatuses() {
        val componentsStatusByEnvironment = uptimeKumaClient.getStatusByEnvironments()

        componentsStatusByEnvironment.forEach { (env, componentStatuses) ->
            addComponentStatusIfChanged(ComponentType.BROKER, env, componentStatuses.broker?.toDb())
            addComponentStatusIfChanged(ComponentType.DAPS, env, componentStatuses.daps?.toDb())
            addComponentStatusIfChanged(ComponentType.LOGGING_HOUSE, env, componentStatuses.loggingHouse?.toDb())
        }
    }

    fun getLatestComponentStatus(component: ComponentType, environment: String): ComponentDowntimesRecord? {
        val c = Tables.COMPONENT_DOWNTIMES

        return dsl.selectFrom(c)
            .where(c.COMPONENT.eq(component)).and(c.ENVIRONMENT.eq(environment))
            .orderBy(c.TIME_STAMP.desc())
            .limit(1)
            .fetchOne()
    }

    fun getFirstRecordBefore(component: ComponentType, limit: OffsetDateTime, environment: String): ComponentDowntimesRecord? {
        val c = Tables.COMPONENT_DOWNTIMES

        return dsl.selectFrom(c)
            .where(c.COMPONENT.eq(component)).and(c.ENVIRONMENT.eq(environment)).and(c.TIME_STAMP.lessThan(limit))
            .orderBy(c.TIME_STAMP.desc())
            .limit(1)
            .fetchOne()
    }

    fun getStatusHistoryAscSince(component: ComponentType, limit: OffsetDateTime, environment: String): List<ComponentDowntimesRecord> {
        val c = Tables.COMPONENT_DOWNTIMES

        return dsl.selectFrom(c)
            .where(c.COMPONENT.eq(component)).and(c.ENVIRONMENT.eq(environment)).and(c.TIME_STAMP.greaterOrEqual(limit))
            .orderBy(c.TIME_STAMP.asc())
            .fetch()
    }

    fun getUpOrDownRecordsOrderByTimestampAsc(environment: String): List<ComponentDowntimesRecord> {
        val c = Tables.COMPONENT_DOWNTIMES

        return dsl.selectFrom(c)
            .where(c.ENVIRONMENT.eq(environment), c.STATUS.eq(DSL.any(ComponentOnlineStatus.UP, ComponentOnlineStatus.DOWN)))
            .orderBy(c.TIME_STAMP.asc())
            .fetch()
    }

    private fun addComponentStatusIfChanged(component: ComponentType, environment: String, status: ComponentOnlineStatus?) {
        val latestStatus = getLatestComponentStatus(component, environment)?.status

        if (status != null && latestStatus != status) {
            dsl.insertInto(Tables.COMPONENT_DOWNTIMES)
                .set(Tables.COMPONENT_DOWNTIMES.COMPONENT, component)
                .set(Tables.COMPONENT_DOWNTIMES.ENVIRONMENT, environment)
                .set(Tables.COMPONENT_DOWNTIMES.STATUS, status)
                .set(Tables.COMPONENT_DOWNTIMES.TIME_STAMP, OffsetDateTime.now())
                .execute()

            Log.info("Component status changed. component=$component, environment=$environment, newStatus=$status, oldStatus=$latestStatus.")
        }
    }
}
