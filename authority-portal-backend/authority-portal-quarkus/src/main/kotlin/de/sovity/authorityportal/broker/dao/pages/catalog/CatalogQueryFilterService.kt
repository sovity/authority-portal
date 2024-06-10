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
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.jooq.Condition
import org.jooq.impl.DSL
import java.time.OffsetDateTime
import java.util.Objects

@ApplicationScoped
class CatalogQueryFilterService(
    val catalogSearchService: CatalogSearchService,
    val deploymentEnvironmentService: DeploymentEnvironmentService
) {
    fun filterDbQuery(
        environment: String,
        fields: CatalogQueryFields,
        searchQuery: String,
        filters: List<CatalogQueryFilter>
    ): Condition {
        val conditions = ArrayList<Condition>()
        conditions.add(catalogSearchService.filterBySearch(fields, searchQuery))
        conditions.add(onlyOnlineOrRecentlyOfflineConnectors(environment, fields.connectorTable))
        conditions.addAll(filters.stream().map<Any>(CatalogQueryFilter::queryFilterClauseOrNull)
            .filter { obj: Any? -> Objects.nonNull(obj) }.map<Any> { it: Any -> it.filterDataOffers(fields) }
            .toList())
        return DSL.and(conditions)
    }

    private fun onlyOnlineOrRecentlyOfflineConnectors(environment: String, c: Connector): Condition {
        val maxOfflineDuration = deploymentEnvironmentService.findByIdOrThrow(environment)
            .broker()
            .hideOfflineDataOffersAfter()
        val maxOfflineDurationNotExceeded =
            c.LAST_SUCCESSFUL_REFRESH_AT.greaterThan(OffsetDateTime.now().minus(maxOfflineDuration))

        return DSL.or(
            c.ONLINE_STATUS.eq(ConnectorOnlineStatus.ONLINE),
            maxOfflineDurationNotExceeded
        )
    }
}
