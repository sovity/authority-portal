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
package de.sovity.authorityportal.broker.dao.pages.catalog.models

import de.sovity.authorityportal.broker.dao.pages.catalog.CatalogQueryFields
import org.jooq.Field

fun interface AvailableFilterValuesQuery {
    /**
     * Gets the values for a given filter attribute from a list of data offers.
     *
     * @param fields a
     * @return field / multiset field that will contain the available values
     */
    fun getAttributeValueField(fields: CatalogQueryFields): Field<String>
}
