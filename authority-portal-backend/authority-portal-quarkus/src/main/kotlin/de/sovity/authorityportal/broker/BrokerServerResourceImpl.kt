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
package de.sovity.authorityportal.broker

import de.sovity.authorityportal.broker.api.BrokerServerResource
import de.sovity.authorityportal.broker.api.model.CatalogPageQuery
import de.sovity.authorityportal.broker.api.model.CatalogPageResult
import de.sovity.authorityportal.broker.api.model.DataOfferDetailPageQuery
import de.sovity.authorityportal.broker.api.model.DataOfferDetailPageResult
import de.sovity.authorityportal.broker.services.api.CatalogApiService
import de.sovity.authorityportal.broker.services.api.DataOfferDetailApiService
import de.sovity.authorityportal.web.auth.AuthUtils
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.transaction.Transactional

/**
 * Implementation of [BrokerServerResource]
 */
@ApplicationScoped
class BrokerServerResourceImpl(
    val catalogApiService: CatalogApiService,
    val dataOfferDetailApiService: DataOfferDetailApiService,
    val authUtils: AuthUtils
) : BrokerServerResource {

    @Transactional
    override fun catalogPage(environment: String, query: CatalogPageQuery): CatalogPageResult {
        authUtils.requiresAuthenticated()
        authUtils.requiresMemberOfAnyOrganization()
        return catalogApiService.catalogPage(environment, query)
    }

    @Transactional
    override fun dataOfferDetailPage(environment: String, query: DataOfferDetailPageQuery): DataOfferDetailPageResult {
        authUtils.requiresAuthenticated()
        authUtils.requiresMemberOfAnyOrganization()
        return dataOfferDetailApiService.dataOfferDetailPage(environment, query)
    }
}
