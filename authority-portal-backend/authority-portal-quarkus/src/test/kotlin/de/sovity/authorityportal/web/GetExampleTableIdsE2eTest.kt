package de.sovity.authorityportal.web

import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.enums.MyExampleStatus
import de.sovity.authorityportal.web.testutils.buildApiClient
import io.quarkus.test.common.http.TestHTTPResource
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.assertj.core.api.Assertions.assertThat
import org.flywaydb.core.Flyway
import org.jooq.DSLContext
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Test
import java.net.URL
import java.time.OffsetDateTime

@QuarkusTest
class GetExampleTableIdsE2eTest {
    @TestHTTPResource
    lateinit var backendUrl: URL

    @Inject
    lateinit var flyway: Flyway

    @Inject
    lateinit var dsl: DSLContext

    @AfterEach
    fun cleanup() {
        flyway.clean()
        flyway.migrate()
    }

    @Test
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

    @Test
    fun exampleTestUsingDatabase2() {
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


    fun createExampleTableRow(id: String, status: MyExampleStatus) {
        val row = dsl.newRecord(Tables.MY_EXAMPLE)
        row.id = id
        row.message = ""
        row.createdAt = OffsetDateTime.now()
        row.status = status
        row.insert()

        val allIds = dsl.select(Tables.MY_EXAMPLE.ID).from(Tables.MY_EXAMPLE).fetchSet(Tables.MY_EXAMPLE.ID)
        assertThat(allIds).contains(id)
    }
}