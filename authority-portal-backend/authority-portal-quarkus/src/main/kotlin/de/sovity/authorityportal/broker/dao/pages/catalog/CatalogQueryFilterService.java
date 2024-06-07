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

package de.sovity.authorityportal.broker.dao.pages.catalog;

import de.sovity.authorityportal.broker.dao.pages.catalog.models.CatalogQueryFilter;
import de.sovity.authorityportal.db.jooq.enums.ConnectorOnlineStatus;
import de.sovity.authorityportal.db.jooq.tables.Connector;
import de.sovity.authorityportal.broker.services.api.filtering.CatalogSearchService;
import de.sovity.authorityportal.broker.services.config.BrokerServerDataspaceSettings;
import de.sovity.authorityportal.web.environment.DeploymentEnvironmentService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.jooq.Condition;
import org.jooq.impl.DSL;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@ApplicationScoped
public class CatalogQueryFilterService {
    @Inject
    CatalogSearchService catalogSearchService;
    @Inject
    DeploymentEnvironmentService deploymentEnvironmentService;

    public Condition filterDbQuery(String environment, CatalogQueryFields fields, String searchQuery, List<CatalogQueryFilter> filters) {
        var conditions = new ArrayList<Condition>();
        conditions.add(catalogSearchService.filterBySearch(fields, searchQuery));
        conditions.add(onlyOnlineOrRecentlyOfflineConnectors(environment, fields.getConnectorTable()));
        conditions.addAll(filters.stream().map(CatalogQueryFilter::queryFilterClauseOrNull)
                .filter(Objects::nonNull).map(it -> it.filterDataOffers(fields)).toList());
        return DSL.and(conditions);
    }

    @NotNull
    private Condition onlyOnlineOrRecentlyOfflineConnectors(String environment, Connector c) {
        var maxOfflineDuration = deploymentEnvironmentService.findByIdOrThrow(environment)
            .broker()
            .hideOfflineDataOffersAfter();

        Condition maxOfflineDurationNotExceeded;
        maxOfflineDurationNotExceeded = c.LAST_SUCCESSFUL_REFRESH_AT.greaterThan(OffsetDateTime.now().minus(maxOfflineDuration));

        return DSL.or(
                c.ONLINE_STATUS.eq(ConnectorOnlineStatus.ONLINE),
                maxOfflineDurationNotExceeded
        );
    }
}
