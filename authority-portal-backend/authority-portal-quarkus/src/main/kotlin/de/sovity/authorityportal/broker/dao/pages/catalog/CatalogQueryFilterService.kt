/*
 *  Copyright (c) 2023 sovity GmbH
 *
 *  This program and the accompanying materials are made available under the
 *  terms of the Apache License, Version 2.0 which is available at
 *  https://www.apache.org/licenses/LICENSE-2.0
 *
 *  SPDX-License-Identifier: Apache-2.0
 *
 *  Contributors:
 *       sovity GmbH - initial API and implementation
 *
 */
package de.sovity.authorityportal.broker.dao.pages.catalog

import de.sovity.authorityportal.broker.dao.pages.catalog.models.CatalogQueryFilter
import de.sovity.authorityportal.broker.services.api.filtering.CatalogSearchService
import de.sovity.authorityportal.db.jooq.enums.ConnectorOnlineStatus
import de.sovity.authorityportal.db.jooq.tables.Connector
import de.sovity.authorityportal.web.environment.DeploymentEnvironmentService
import de.sovity.authorityportal.web.utils.TimeUtils
import jakarta.enterprise.context.ApplicationScoped
import org.jooq.Condition
import org.jooq.impl.DSL

@ApplicationScoped
class CatalogQueryFilterService(
    val catalogSearchService: CatalogSearchService,
    val deploymentEnvironmentService: DeploymentEnvironmentService,
    val timeUtils: TimeUtils
) {
    fun filterDbQuery(
        environment: String,
        fields: CatalogQueryFields,
        searchQuery: String?,
        filters: List<CatalogQueryFilter>
    ): Condition {
        val conditions = ArrayList<Condition>()
        conditions.add(fields.dataOfferTable.ENVIRONMENT.eq(environment))
        conditions.add(visibleConnectorsOfEnvironment(environment, fields.connectorTable))
        conditions.add(catalogSearchService.filterBySearch(fields, searchQuery))
        conditions.addAll(filters.mapNotNull { it.queryFilterClauseOrNull }.map { it(fields) })
        return DSL.and(conditions)
    }

    private fun visibleConnectorsOfEnvironment(environment: String, c: Connector): Condition {
        val maxOfflineDuration = deploymentEnvironmentService.findByIdOrThrow(environment)
            .broker()
            .hideOfflineDataOffersAfter()
        val maxOfflineDurationNotExceeded = c.LAST_SUCCESSFUL_REFRESH_AT
            .greaterThan(timeUtils.now().minus(maxOfflineDuration))
        val isOnline = c.ONLINE_STATUS.eq(ConnectorOnlineStatus.ONLINE)

        return DSL.or(isOnline, maxOfflineDurationNotExceeded)
    }
}
