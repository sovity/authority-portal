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

import org.jooq.Field
import org.jooq.TableLike
import org.jooq.impl.DSL
import kotlin.reflect.KClass

object MultisetUtils {
    fun <R : Any> multiset(table: TableLike<*>, type: KClass<R>): Field<List<R>> {
        return DSL.multiset(table).convertFrom { it.into (type.java) }
    }
}
