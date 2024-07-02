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
package de.sovity.authorityportal.broker.dao.pages.dataoffer

import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.web.utils.TimeUtils
import jakarta.enterprise.context.ApplicationScoped
import org.jooq.DSLContext

@ApplicationScoped
class ViewCountLogger(
    val dsl: DSLContext,
    val timeUtils: TimeUtils
) {
    fun increaseDataOfferViewCount(assetId: String, endpoint: String) {
        val v = Tables.DATA_OFFER_VIEW_COUNT
        dsl.insertInto(v, v.ASSET_ID, v.CONNECTOR_ID, v.DATE).values(assetId, endpoint, timeUtils.now()).execute()
    }
}
