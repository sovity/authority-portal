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

package de.sovity.authorityportal.web.utils

class PersonNameUtils {
    companion object {
        /**
         * Splits a person's name into first and last name. The split is done at the right-most white space.
         * A potential second name is wrapped into firstName.
         *
         * @param name the name to split
         * @return a pair of first and last name
         */
        fun splitName(name: String): PersonName {
            val splitIndex = name.lastIndexOf(" ")
            val parts = if (splitIndex == -1) {
                arrayOf(name, "")
            } else {
                arrayOf(name.substring(0, splitIndex), name.substring(splitIndex + 1))
            }
            return PersonName(parts[0], parts[1])
        }
    }

    data class PersonName(val firstName: String, val lastName: String)
}
