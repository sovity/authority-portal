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
package de.sovity.authorityportal.broker.services.api.filtering

import de.sovity.authorityportal.broker.dao.pages.catalog.CatalogQueryFields
import de.sovity.authorityportal.broker.dao.utils.eqAny
import de.sovity.authorityportal.broker.services.api.filtering.model.FilterAttributeDefinition
import jakarta.enterprise.context.ApplicationScoped
import org.jooq.Field

@ApplicationScoped
class CatalogFilterAttributeDefinitionService {
    fun forField(
        fieldExtractor: (CatalogQueryFields) -> Field<String>,
        name: String,
        label: String
    ): FilterAttributeDefinition {
        return FilterAttributeDefinition(
            name = name,
            label = label,
            valueFn = fieldExtractor
        ) { fields, values -> fieldExtractor(fields).eqAny(values) }
    }

    fun buildDataSpaceFilter(): FilterAttributeDefinition {
        return FilterAttributeDefinition(
            name = "dataSpace",
            label = "Data Space",
            valueFn = CatalogQueryFields::dataSpace
        ) { fields, values -> fields.dataSpace.eqAny(values) }
    }
}
