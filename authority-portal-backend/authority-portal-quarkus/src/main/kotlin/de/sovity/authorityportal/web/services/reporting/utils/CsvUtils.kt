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
package de.sovity.authorityportal.web.services.reporting.utils

import com.opencsv.CSVWriter
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream


data class CsvColumn<T>(val name: String, val getter: (T) -> String)

fun <T> buildCsv(columns: List<CsvColumn<T>>, rows: Collection<T>): ByteArrayInputStream {
    val out = mutableListOf<Array<String>>()
    out.add(columns.map { it.name }.toTypedArray())
    out.addAll(rows.map { row -> columns.map { it.getter(row) }.toTypedArray() })
    return buildCsvRaw(out)
}

private fun buildCsvRaw(csvData: MutableList<Array<String>>): ByteArrayInputStream {
    val outputStream = ByteArrayOutputStream()
    CSVWriter(outputStream.writer()).use { csvWriter ->
        csvWriter.writeAll(csvData)
    }

    return ByteArrayInputStream(outputStream.toByteArray())
}
