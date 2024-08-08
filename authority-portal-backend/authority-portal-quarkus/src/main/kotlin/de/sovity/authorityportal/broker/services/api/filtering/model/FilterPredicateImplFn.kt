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
import org.jooq.Condition

/**
 * Non-null actual condition to be added to the query
 *
 * Already knows its list of values, so it was created for one filter attribute of one request
 */
typealias FilterPredicateImplFn = (CatalogQueryFields) -> Condition
