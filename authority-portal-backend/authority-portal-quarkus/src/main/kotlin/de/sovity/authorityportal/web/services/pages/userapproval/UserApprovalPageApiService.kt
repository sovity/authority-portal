package de.sovity.authorityportal.web.services.pages.userapproval

import de.sovity.authorityportal.api.model.UserApprovalPageQuery
import de.sovity.authorityportal.api.model.UserApprovalPageResult
import de.sovity.authorityportal.api.model.UserRoleDto
import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.web.services.thirdparty.keycloak.KeycloakService
import de.sovity.authorityportal.web.services.thirdparty.keycloak.model.UserRegistrationStatus
import de.sovity.authorityportal.web.services.toDb
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.jooq.DSLContext

@ApplicationScoped
class UserApprovalPageApiService {
    @Inject
    lateinit var keycloakService: KeycloakService

    @Inject
    lateinit var dsl: DSLContext

    @Inject
    lateinit var userApprovalPageUserMapper: UserApprovalPageUserMapper

    fun userApprovalPage(query: UserApprovalPageQuery): UserApprovalPageResult {
        val users = keycloakService.listUsers()

        val userDtos = users
            .filter { it.registrationStatus == UserRegistrationStatus.PENDING }
            .map { userApprovalPageUserMapper.buildUserListEntry(it) }

        return UserApprovalPageResult(userDtos)
    }

    /**
     * TODO: Will get different functionality with the next PR
     */
    fun updateUserRole(userId: String, roleDto: UserRoleDto): String {
        val u = Tables.USER!!

        dsl.update(u)
            .set(u.ROLE, roleDto.toDb())
            .where(u.ID.eq(userId))
            .execute()

        return userId
    }
}
