package de.sovity.authorityportal.web.services

import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.enums.UserRole
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.jooq.DSLContext
import org.jooq.impl.DSL
import java.time.OffsetDateTime

@ApplicationScoped
class UserApprovalPageQueryService {
    @Inject
    lateinit var dsl: DSLContext

    data class UserListEntryRs(
        val userId: String,
        val firstName: String,
        val lastName: String,
        val createdAt: OffsetDateTime,
        val role: UserRole
    )

    fun queryUsers(searchQuery: String?): List<UserListEntryRs> {
        val u = Tables.USER!!
        val condition = when {
            searchQuery.isNullOrBlank() -> DSL.trueCondition()
            else -> u.FIRST_NAME.eq(searchQuery)
        }

        return dsl.select(u.ID.`as`("userId"), u.FIRST_NAME, u.LAST_NAME, u.CREATED_AT, u.ROLE)
            .from(u)
            .where(condition)
            .orderBy(u.LAST_NAME, u.FIRST_NAME)
            .fetchInto(UserListEntryRs::class.java)
    }
}
