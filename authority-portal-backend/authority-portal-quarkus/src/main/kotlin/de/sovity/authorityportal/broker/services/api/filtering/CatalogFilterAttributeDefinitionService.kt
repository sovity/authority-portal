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

import de.sovity.authorityportal.api.model.catalog.CnfFilterAttributeDisplayType
import de.sovity.authorityportal.broker.dao.pages.catalog.CatalogQueryFields
import de.sovity.authorityportal.broker.dao.utils.eqAny
import de.sovity.authorityportal.broker.services.api.filtering.model.FilterAttributeDefinition
import jakarta.enterprise.context.ApplicationScoped
import org.jooq.Field

@ApplicationScoped
class CatalogFilterAttributeDefinitionService {
    fun forIdOnlyField(
        fieldExtractor: (CatalogQueryFields) -> Field<String>,
        name: String,
        label: String
    ): FilterAttributeDefinition {
        return FilterAttributeDefinition(
            name = name,
            label = label,
            displayType = CnfFilterAttributeDisplayType.TITLE_ONLY,
            idField = fieldExtractor,
            nameField = null
        ) { fields, values -> fieldExtractor(fields).eqAny(values) }
    }

    fun forIdNameProperty(
        idFieldExtractor: (CatalogQueryFields) -> Field<String>,
        nameFieldExtractor: (CatalogQueryFields) -> Field<String>,
        name: String,
        label: String
    ): FilterAttributeDefinition {
        return FilterAttributeDefinition(
            name = name,
            label = label,
            displayType = CnfFilterAttributeDisplayType.ID_AND_TITLE,
            idField = idFieldExtractor,
            nameField = nameFieldExtractor
        ) { fields, values -> idFieldExtractor(fields).eqAny(values) }
    }

    fun buildDataSpaceFilter(): FilterAttributeDefinition {
        return FilterAttributeDefinition(
            name = "dataSpace",
            label = "Data Space",
            displayType = CnfFilterAttributeDisplayType.TITLE_ONLY,
            idField = CatalogQueryFields::dataSpace,
            nameField = null
        ) { fields, values -> fields.dataSpace.eqAny(values) }
    }
}
