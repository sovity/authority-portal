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
import de.sovity.authorityportal.broker.api.model.AuthorityPortalConnectorDataOfferInfo
import de.sovity.authorityportal.broker.api.model.CatalogPageQuery
import de.sovity.authorityportal.broker.api.model.CatalogPageResult
import de.sovity.authorityportal.broker.api.model.DataOfferDetailPageQuery
import de.sovity.authorityportal.broker.api.model.DataOfferDetailPageResult
import de.sovity.authorityportal.broker.services.api.AuthorityPortalConnectorDataOfferApiService
import de.sovity.authorityportal.broker.services.api.CatalogApiService
import de.sovity.authorityportal.broker.services.api.DataOfferDetailApiService
import de.sovity.authorityportal.web.auth.AuthUtils
import jakarta.enterprise.context.ApplicationScoped
import jakarta.transaction.Transactional

/**
 * Implementation of [BrokerServerResource]
 */
@ApplicationScoped
class BrokerServerResourceImpl(
    private val catalogApiService: CatalogApiService,
    private val dataOfferDetailApiService: DataOfferDetailApiService,
    private val authUtils: AuthUtils
) : BrokerServerResource {


    @Transactional
    override fun catalogPage(query: CatalogPageQuery): CatalogPageResult {
        return catalogApiService.catalogPage(query)
    }

    @Transactional
    override fun dataOfferDetailPage(query: DataOfferDetailPageQuery): DataOfferDetailPageResult {
        return dataOfferDetailApiService.dataOfferDetailPage(query)
    }

    @Transactional
    override fun getConnectorDataOffers(
        endpoints: List<String>,
        adminApiKey: String
    ): MutableList<AuthorityPortalConnectorDataOfferInfo> {
        authUtils.requiresAuthenticated()
        return authorityPortalConnectorDataOffersApiService.getConnectorDataOffersByEndpoints(endpoints)
    }
}
