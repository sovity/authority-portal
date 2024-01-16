package de.sovity.authorityportal.web.pages.organizationmanagement

import de.sovity.authorityportal.api.model.IdResponse
import de.sovity.authorityportal.api.model.InviteOrganizationRequest
import de.sovity.authorityportal.api.model.organization.CreateOrganizationRequest
import de.sovity.authorityportal.db.jooq.enums.OrganizationRegistrationStatus
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.services.UserService
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import de.sovity.authorityportal.web.thirdparty.keycloak.model.OrganizationRole
import de.sovity.authorityportal.web.utils.idmanagement.MdsIdUtils
import io.quarkus.logging.Log
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class OrganizationInvitationApiService {

    @Inject
    lateinit var keycloakService: KeycloakService

    @Inject
    lateinit var organizationService: OrganizationService

    @Inject
    lateinit var userService: UserService

    @Inject
    lateinit var mdsIdUtils: MdsIdUtils

    fun inviteOrganization(invitationInformation: InviteOrganizationRequest, adminUserId: String): IdResponse {
        val mdsId = mdsIdUtils.generateMdsId()
        val userId = createKeycloakUserAndOrganization(mdsId, invitationInformation)
        createDbUserAndOrganization(userId, mdsId, invitationInformation)
        keycloakService.sendInvitationEmail(userId)

        Log.info("Invited organization and corresponding initial Participant Admin. mdsId=$mdsId, userId=$userId, adminUserId=$adminUserId.")

        return IdResponse(mdsId)
    }

    private fun createKeycloakUserAndOrganization(mdsId: String, invitationInformation: InviteOrganizationRequest): String {
        val userId = keycloakService.createUser(
            invitationInformation.userEmail,
            invitationInformation.userFirstName,
            invitationInformation.userLastName
        )
        keycloakService.createOrganization(mdsId)
        keycloakService.joinOrganization(userId, mdsId, OrganizationRole.PARTICIPANT_ADMIN)

        return userId
    }

    private fun createDbUserAndOrganization(userId: String, mdsId: String, invitationInformation: InviteOrganizationRequest) {
        val user = userService.createUser(userId, UserRegistrationStatus.INVITED)
        organizationService.createOrganization(
            userId,
            mdsId,
            buildCreateOrganizationRequest(invitationInformation),
            OrganizationRegistrationStatus.INVITED
        )
        user.organizationMdsId = mdsId
        user.update()
    }

    private fun buildCreateOrganizationRequest(invitationInformation: InviteOrganizationRequest): CreateOrganizationRequest {
        return CreateOrganizationRequest().apply {
            name = invitationInformation.orgName
            address = invitationInformation.orgAddress
            taxId = invitationInformation.orgDuns
            url = invitationInformation.orgUrl
            securityEmail = invitationInformation.orgSecurityEmail
        }
    }
}
