/*
 * Copyright (c) 2024 sovity GmbH
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Contributors:
 *      sovity GmbH - initial implementation
 */
package de.sovity.authorityportal.broker.services.api.filtering.model

import de.sovity.authorityportal.broker.dao.pages.catalog.CatalogQueryFields
import org.jooq.Field

/**
 * Gets the values for a given filter attribute from a list of data offers.
 */
typealias FilterValueFn = (CatalogQueryFields) -> Field<String>
