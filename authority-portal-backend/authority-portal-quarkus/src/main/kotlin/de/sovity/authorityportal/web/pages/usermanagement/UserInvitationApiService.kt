package de.sovity.authorityportal.web.pages.usermanagement

import de.sovity.authorityportal.api.model.IdResponse
import de.sovity.authorityportal.api.model.InviteParticipantUserRequest
import de.sovity.authorityportal.db.jooq.enums.UserOnboardingType
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.web.services.UserService
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import io.quarkus.logging.Log
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class UserInvitationApiService {

    @Inject
    lateinit var keycloakService: KeycloakService

    @Inject
    lateinit var userService: UserService

    @Inject
    lateinit var userRoleMapper: UserRoleMapper

    fun inviteParticipantUser(
        userInformation: InviteParticipantUserRequest,
        mdsId: String,
        adminUserId: String
    ): IdResponse {
        val userId = keycloakService.createUser(userInformation.email, userInformation.firstName, userInformation.lastName)
        keycloakService.sendInvitationEmailWithPasswordReset(userId)
        keycloakService.joinOrganization(userId, mdsId, userRoleMapper.toOrganizationRole(userInformation.role, userId, adminUserId))

        userService.createUser(
            userId = userId,
            mdsId = mdsId,
            onboardingType = UserOnboardingType.INVITATION,
            invitedBy = adminUserId
        )

        Log.info("New participant account invited. userId=$userId, role=${userInformation.role}, mdsId=$mdsId, adminUserId=$adminUserId")

        return IdResponse(userId)
    }
}
