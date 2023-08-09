package de.sovity.authorityportal.web

import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.enums.MyExampleStatus
import de.sovity.authorityportal.web.services.ExampleTableApiService
import io.quarkus.test.TestTransaction
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.assertj.core.api.Assertions.assertThat
import org.jooq.DSLContext
import org.junit.jupiter.api.Test
import java.time.OffsetDateTime

@QuarkusTest
class GetExampleTableIdsIntegrationTest {
    @Inject
    lateinit var exampleTableApiService: ExampleTableApiService

    @Inject
    lateinit var dsl: DSLContext

    @Test
    @TestTransaction
    fun exampleTestUsingDatabase() {
        // arrange
        createExampleTableRow("1", MyExampleStatus.OK)
        createExampleTableRow("2", MyExampleStatus.OK)
        createExampleTableRow("3", MyExampleStatus.FAILURE)

        // act
        val actual = exampleTableApiService.getExampleTableIds()

        // assert
        assertThat(actual).containsExactly("1", "2")
    }

    @Test
    @TestTransaction
    fun exampleTestUsingDatabase2() {
        // arrange
        createExampleTableRow("1", MyExampleStatus.OK)
        createExampleTableRow("2", MyExampleStatus.OK)
        createExampleTableRow("3", MyExampleStatus.FAILURE)

        // act
        val actual = exampleTableApiService.getExampleTableIds()

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
