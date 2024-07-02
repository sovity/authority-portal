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

fun <T, R> Field<T>.mapInline(mapping: Map<T, R>, default: R): Field<R> {
    if (mapping.isEmpty()) {
        return DSL.`val`(default)
    }

    val entries = mapping.entries.toList()

    val first = entries.first()
    var caseExpression = DSL.case_(this).`when`(first.key, first.value)

    entries.drop(1).forEach {
        caseExpression = caseExpression.`when`(it.key, it.value)
    }

    return caseExpression.else_(DSL.`val`(default))
}
