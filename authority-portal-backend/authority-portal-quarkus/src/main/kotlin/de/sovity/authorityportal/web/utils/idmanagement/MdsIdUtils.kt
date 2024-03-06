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

package de.sovity.authorityportal.web.utils.idmanagement

import de.sovity.authorityportal.db.jooq.Tables
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.jooq.DSLContext

@ApplicationScoped
class MdsIdUtils {

    companion object {
        const val MDS_ID_LENGTH = 4
    }

    @Inject
    lateinit var dsl: DSLContext

    @Inject
    lateinit var idUtils: IdUtils

    fun generateMdsId(): String {
        val usedMdsIds = getUsedMdsIds()
        var mdsId: String

        do {
            mdsId = getMdsIdCandidate()
        } while (usedMdsIds.contains(mdsId))

        return mdsId
    }

    fun assertValidMdsId(mdsId: String) {
        if (!validateMdsId(mdsId)) {
            error("Invalid MDS-ID: $mdsId")
        }
    }

    private fun validateMdsId(mdsId: String): Boolean {
        val checksum = mdsId.takeLast(2)
        val id = mdsId.drop(4).dropLast(2)

        return idUtils.calculateVerificationDigits(id) == checksum
    }

    private fun getMdsIdCandidate(): String {
        val prefix = "MDSL"
        val identifier = idUtils.randomIdentifier(MDS_ID_LENGTH)
        val checksum = idUtils.calculateVerificationDigits(identifier)
        return "$prefix$identifier$checksum"
    }

    private fun getUsedMdsIds(): Set<String> {
        val o = Tables.ORGANIZATION
        return dsl.select(o.MDS_ID)
            .from(o)
            .fetchSet(o.MDS_ID)
    }
}
