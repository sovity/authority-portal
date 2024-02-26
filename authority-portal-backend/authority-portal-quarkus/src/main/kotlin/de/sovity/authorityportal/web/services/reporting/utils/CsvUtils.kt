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
