package de.sovity.authorityportal.web.pages.usermanagement

import de.sovity.authorityportal.api.model.IdResponse
import de.sovity.authorityportal.api.model.InviteParticipantUserRequest
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
        val keycloakUser = keycloakService.createUser(userInformation.email, userInformation.firstName, userInformation.lastName)
        keycloakService.sendInvitationEmail(keycloakUser.userId)
        keycloakService.joinOrganization(keycloakUser.userId, mdsId, userRoleMapper.toOrganizationRole(userInformation.role, keycloakUser.userId, adminUserId))

        userService.registerUserWithDetails(
            userId = keycloakUser.userId,
            registrationStatus = UserRegistrationStatus.INVITED,
            email = userInformation.email,
            firstName = userInformation.firstName,
            lastName = userInformation.lastName,
            jobTitle = null,
            phone = null,
            mdsId = mdsId
        )

        Log.info("New participant account invited. userId=${keycloakUser.userId}, role=${userInformation.role}, mdsId=$mdsId, adminUserId=$adminUserId")

        return IdResponse(keycloakUser.userId)
    }
}
