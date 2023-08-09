package de.sovity.authorityportal.web.services

import de.sovity.authorityportal.api.model.UserApprovalPageQuery
import de.sovity.authorityportal.api.model.UserApprovalPageResult
import de.sovity.authorityportal.api.model.UserListEntryDto
import de.sovity.authorityportal.api.model.UserRoleDto
import de.sovity.authorityportal.db.jooq.Tables
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.jooq.DSLContext

@ApplicationScoped
class UserApprovalPageApiService {
    @Inject
    lateinit var dsl: DSLContext

    @Inject
    lateinit var userApprovalPageQueryService: UserApprovalPageQueryService

    fun userApprovalPage(query: UserApprovalPageQuery): UserApprovalPageResult {
        val users = userApprovalPageQueryService.queryUsers(query.searchQuery)

        val userDtos = users.map {
            val userDto = UserListEntryDto()

            userDto.userId = it.userId
            userDto.lastName = it.lastName
            userDto.createdAt = it.createdAt
            userDto.firstName = it.firstName
            userDto.lastName = it.lastName
            userDto.role = it.role.toDto()
            userDto.userId = it.userId

            userDto
        }

        return UserApprovalPageResult(userDtos)
    }

    fun updateUserRole(userId: String, roleDto: UserRoleDto): String {
        val u = Tables.USER!!

        dsl.update(u)
            .set(u.ROLE, roleDto.toDb())
            .where(u.ID.eq(userId))
            .execute()

        return userId
    }
}
