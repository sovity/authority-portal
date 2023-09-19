package de.sovity.authorityportal.web.services.pages.userregistration

import de.sovity.authorityportal.api.model.CreateOrganizationRequest
import de.sovity.authorityportal.api.model.UserRegistrationStatusResult
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.web.services.db.OrganizationService
import de.sovity.authorityportal.web.services.db.UserService
import de.sovity.authorityportal.web.services.thirdparty.keycloak.KeycloakService
import de.sovity.authorityportal.web.services.thirdparty.keycloak.model.OrganizationRole
import de.sovity.authorityportal.web.services.utils.idmanagement.MdsIdUtils
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class UserRegistrationApiService {

    @Inject
    lateinit var keycloakService: KeycloakService

    @Inject
    lateinit var organizationService: OrganizationService

    @Inject
    lateinit var userService: UserService

    @Inject
    lateinit var mdsIdUtils: MdsIdUtils

    fun userRegistrationStatus(userId: String): UserRegistrationStatusResult {
        val user = userService.getUserOrThrow(userId)

        return UserRegistrationStatusResult(user.registrationStatus.toDto())
    }

    fun createOrganization(userId: String, organization: CreateOrganizationRequest): String {
        val mdsId = mdsIdUtils.generateMdsId()

        keycloakService.createOrganization(mdsId)
        keycloakService.joinOrganization(userId, mdsId, OrganizationRole.PARTICIPANT_ADMIN)
        keycloakService.invalidateUserSessions(userId)

        organizationService.createOrganization(userId, mdsId, organization)
        val user = userService.getUserOrThrow(userId)
        user.registrationStatus = UserRegistrationStatus.PENDING
        user.organizationMdsId = mdsId
        user.update()

        return mdsId
    }
}
