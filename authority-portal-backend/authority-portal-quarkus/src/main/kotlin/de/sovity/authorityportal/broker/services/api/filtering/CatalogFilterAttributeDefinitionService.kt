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
import jakarta.enterprise.context.ApplicationScoped
import org.jooq.Field

@ApplicationScoped
class CatalogFilterAttributeDefinitionService {
    fun forField(
        fieldExtractor: (CatalogQueryFields) -> Field<String>,
        name: String,
        label: String
    ): CatalogFilterAttributeDefinition {
        return CatalogFilterAttributeDefinition(
            name,
            label,
            fieldExtractor
        ) { fields, values -> fieldExtractor(fields).eqAny(values) }
    }

    fun buildDataSpaceFilter(): CatalogFilterAttributeDefinition {
        return CatalogFilterAttributeDefinition(
            "dataSpace",
            "Data Space",
            CatalogQueryFields::dataSpace
        ) { fields, values -> fields.dataSpace.eqAny(values) }
    }
}
