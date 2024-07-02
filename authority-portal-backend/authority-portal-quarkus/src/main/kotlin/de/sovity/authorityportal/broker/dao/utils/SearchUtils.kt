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

import de.sovity.authorityportal.broker.dao.utils.LikeUtils.contains
import de.sovity.authorityportal.web.utils.lowercaseWords
import org.jooq.Condition
import org.jooq.Field
import org.jooq.impl.DSL

/**
 * DB Search Queries
 */
object SearchUtils {
    /**
     * Simple search
     * <br></br>
     * All search query words must be contained in at least one search target.
     *
     * @param searchQuery   search query
     * @param searchTargets target fields
     * @return JOOQ Condition
     */
    fun simpleSearch(searchQuery: String?, searchTargets: List<Field<String?>>): Condition {
        val words = searchQuery.lowercaseWords()
        return DSL.and(words.map { anySearchTargetContains(searchTargets, it) })
    }

    private fun anySearchTargetContains(searchTargets: List<Field<String?>>, word: String): Condition {
        return DSL.or(searchTargets.map { contains(it, word) })
    }
}
