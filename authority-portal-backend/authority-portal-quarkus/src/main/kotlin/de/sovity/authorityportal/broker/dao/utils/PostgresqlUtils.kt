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
package de.sovity.authorityportal.broker.dao.utils

import org.jooq.Condition
import org.jooq.Field
import org.jooq.impl.DSL

/**
 * Replaces the IN operation with "field = ANY(...)"
 *
 * @param values values
 * @return condition
 */
fun Field<String>.eqAny(values: Collection<String>): Condition = this.eq(DSL.any(*values.toTypedArray()))
