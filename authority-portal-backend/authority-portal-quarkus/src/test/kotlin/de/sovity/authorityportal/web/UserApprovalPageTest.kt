package de.sovity.authorityportal.web

import de.sovity.authorityportal.api.model.UserApprovalPageQuery
import de.sovity.authorityportal.api.model.UserRoleDto
import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.enums.UserRole
import de.sovity.authorityportal.web.services.UserApprovalPageApiService
import io.quarkus.test.TestTransaction
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.assertj.core.api.Assertions.assertThat
import org.jooq.DSLContext
import org.junit.jupiter.api.Test
import java.time.OffsetDateTime

@QuarkusTest
class UserApprovalPageTest {
    @Inject
    lateinit var userApprovalPageApiService: UserApprovalPageApiService

    @Inject
    lateinit var dsl: DSLContext

    @Test
    @TestTransaction
    fun testUserApprovalPage() {
        // arrange
        val today = OffsetDateTime.now()
        createExampleUser("1", UserRole.USER, today)

        // act
        val actual = userApprovalPageApiService.userApprovalPage(UserApprovalPageQuery(""))

        // assert
        assertThat(actual.users).hasSize(1)

        val user = actual.users.first()
        assertThat(user.userId).isEqualTo("1")
        assertThat(user.firstName).isEqualTo("1-firstName")
        assertThat(user.lastName).isEqualTo("1-lastName")
        assertThat(user.createdAt).isEqualToIgnoringNanos(today)
        assertThat(user.role).isEqualTo(UserRoleDto.USER)
    }

    private fun createExampleUser(id: String, userRole: UserRole, createdAt: OffsetDateTime) {
        val row = dsl.newRecord(Tables.USER)
        row.id = id
        row.firstName = "$id-firstName"
        row.lastName = "$id-lastName"
        row.createdAt = createdAt
        row.role = userRole
        row.insert()
    }
}
