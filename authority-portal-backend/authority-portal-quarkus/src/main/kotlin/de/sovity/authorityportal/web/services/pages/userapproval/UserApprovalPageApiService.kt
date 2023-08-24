package de.sovity.authorityportal.web.services.pages.userapproval

import de.sovity.authorityportal.api.model.UserApprovalPageResult
import de.sovity.authorityportal.web.services.thirdparty.keycloak.KeycloakService
import de.sovity.authorityportal.web.services.thirdparty.keycloak.model.UserRegistrationStatus
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

    fun userApprovalPage(): UserApprovalPageResult {
        val users = keycloakService.listUsers()

        val userDtos = users
            .filter { it.registrationStatus == UserRegistrationStatus.PENDING }
            .map { userApprovalPageUserMapper.buildUserListEntry(it) }

        return UserApprovalPageResult(userDtos)
    }

    fun approveUser(userId: String): String {
        checkUserIsPending(userId)
        keycloakService.updateStatus(userId, UserRegistrationStatus.APPROVED)

        return userId
    }

    fun rejectUser(userId: String): String {
        checkUserIsPending(userId)
        keycloakService.updateStatus(userId, UserRegistrationStatus.REJECTED)

        return userId
    }

    private fun checkUserIsPending(userId: String) {
        if (keycloakService.getUser(userId).registrationStatus != UserRegistrationStatus.PENDING) {
            throw IllegalStateException("User is not in status \"pending\"")
        }
    }
}
