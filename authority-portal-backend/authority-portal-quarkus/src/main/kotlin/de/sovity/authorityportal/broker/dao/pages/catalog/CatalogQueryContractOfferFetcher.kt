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

import de.sovity.authorityportal.broker.dao.pages.dataoffer.model.ContractOfferRs
import de.sovity.authorityportal.broker.dao.utils.MultisetUtils
import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.tables.DataOffer
import jakarta.enterprise.context.ApplicationScoped
import org.jooq.Field
import org.jooq.impl.DSL

@ApplicationScoped
class CatalogQueryContractOfferFetcher {
    /**
     * Query a data offer's contract offers.
     *
     * @param d Data offer table
     * @return [Field] of [ContractOfferRs]s
     */
    fun getContractOffers(d: DataOffer): Field<List<ContractOfferRs>> {
        val co = Tables.CONTRACT_OFFER

        val query = DSL.select(
            co.CONTRACT_OFFER_ID,
            co.UI_POLICY_JSON.cast(String::class.java).`as`("policyUiJson"),
            co.CREATED_AT,
            co.UPDATED_AT
        ).from(co).where(
            co.CONNECTOR_ID.eq(d.CONNECTOR_ID),
            co.ASSET_ID.eq(d.ASSET_ID)
        ).orderBy(
            co.CREATED_AT.desc()
        )

        return MultisetUtils.multiset(query, ContractOfferRs::class.java)
    }
}
