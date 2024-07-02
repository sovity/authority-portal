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

import org.apache.commons.lang3.StringUtils
import org.jooq.Condition
import org.jooq.Field
import org.jooq.impl.DSL

/**
 * Utilities for dealing with PostgreSQL Like Operation values
 */
object LikeUtils {
    /**
     * Create LIKE condition value for "field contains word".
     *
     * @param field         field
     * @param lowercaseWord word
     * @return "%escapedWord%"
     */
    fun contains(field: Field<String?>, lowercaseWord: String): Condition {
        if (StringUtils.isBlank(lowercaseWord)) {
            return DSL.trueCondition()
        }

        return field.likeIgnoreCase("%" + escape(lowercaseWord) + "%")
    }


    /**
     * Escapes "\", "%", "_" in given string for a LIKE operation
     *
     * @param string unescaped string
     * @return escaped string
     */
    private fun escape(string: String): String {
        return string.replace("\\", "\\\\")
            .replace("%", "\\%")
            .replace("_", "\\_")
    }
}
