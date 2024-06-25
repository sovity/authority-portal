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

import de.sovity.authorityportal.broker.api.CatalogResource
import de.sovity.authorityportal.broker.api.model.CatalogPageQuery
import de.sovity.authorityportal.broker.api.model.CatalogPageResult
import de.sovity.authorityportal.broker.api.model.DataOfferDetailPageQuery
import de.sovity.authorityportal.broker.api.model.DataOfferDetailPageResult
import de.sovity.authorityportal.broker.services.api.CatalogApiService
import de.sovity.authorityportal.broker.services.api.DataOfferDetailApiService
import de.sovity.authorityportal.web.auth.AuthUtils
import jakarta.enterprise.context.ApplicationScoped
import jakarta.transaction.Transactional

/**
 * Implementation of [CatalogResource]
 */
@ApplicationScoped
class CatalogResourceImpl(
    val catalogApiService: CatalogApiService,
    val dataOfferDetailApiService: DataOfferDetailApiService,
    val authUtils: AuthUtils
) : CatalogResource {

    @Transactional
    override fun catalogPage(environmentId: String, query: CatalogPageQuery): CatalogPageResult {
        authUtils.requiresAuthenticated()
        authUtils.requiresMemberOfAnyOrganization()
        return catalogApiService.catalogPage(environmentId, query)
    }

    @Transactional
    override fun dataOfferDetailPage(environmentId: String, query: DataOfferDetailPageQuery): DataOfferDetailPageResult {
        authUtils.requiresAuthenticated()
        authUtils.requiresMemberOfAnyOrganization()
        return dataOfferDetailApiService.dataOfferDetailPage(environmentId, query)
    }
}
