package de.sovity.authorityportal.web

import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.enums.MyExampleStatus
import io.quarkus.test.TestTransaction
import io.quarkus.test.common.http.TestHTTPResource
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.assertj.core.api.Assertions.assertThat
import org.jooq.DSLContext
import org.junit.jupiter.api.Test
import java.net.URL
import java.time.OffsetDateTime

@QuarkusTest
class UiResourceGetExampleTableIdsTest {
    @TestHTTPResource
    lateinit var backendUrl: URL

    @Inject
    lateinit var dsl: DSLContext

    @Test
    @TestTransaction
    fun exampleTestUsingDatabase() {
        // arrange
        val client = buildApiClient(backendUrl)
        createExampleTableRow("1", MyExampleStatus.OK)
        createExampleTableRow("2", MyExampleStatus.OK)
        createExampleTableRow("3", MyExampleStatus.FAILURE)

        // act
        val actual = client.uiApi().exampleDbQuery()

        // assert
        assertThat(actual).containsExactly("1", "2")
    }

    private fun createExampleTableRow(id: String, status: MyExampleStatus) {
        val row = dsl.newRecord(Tables.MY_EXAMPLE)
        row.id = id
        row.message = ""
        row.createdAt = OffsetDateTime.now()
        row.status = status
        row.insert()
    }
}