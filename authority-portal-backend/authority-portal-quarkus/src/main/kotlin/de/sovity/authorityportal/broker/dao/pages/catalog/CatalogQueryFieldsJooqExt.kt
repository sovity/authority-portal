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

import org.jooq.Record
import org.jooq.SelectOnConditionStep
import org.jooq.SelectSelectStep


fun <R :  Record> SelectSelectStep<R>.fromCatalogQueryTables(fields: CatalogQueryFields): SelectOnConditionStep<R> {
    val c = fields.connectorTable
    val d = fields.dataOfferTable
    val org = fields.organizationTable

    return this.from(d)
        .leftJoin(c).on(c.CONNECTOR_ID.eq(d.CONNECTOR_ID))
        .leftJoin(org).on(org.MDS_ID.eq(c.MDS_ID))
}
