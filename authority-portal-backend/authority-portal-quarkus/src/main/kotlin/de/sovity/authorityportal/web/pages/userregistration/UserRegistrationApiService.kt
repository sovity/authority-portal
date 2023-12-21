package de.sovity.authorityportal.web.pages.userregistration

import de.sovity.authorityportal.api.model.IdResponse
import de.sovity.authorityportal.api.model.UserRegistrationStatusResult
import de.sovity.authorityportal.api.model.organization.CreateOrganizationRequest
import de.sovity.authorityportal.db.jooq.enums.OrganizationRegistrationStatus
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.web.pages.organizationmanagement.OrganizationRegistrationApiService
import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.services.UserService
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import de.sovity.authorityportal.web.thirdparty.keycloak.model.OrganizationRole
import de.sovity.authorityportal.web.utils.idmanagement.MdsIdUtils
import io.quarkus.logging.Log
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class UserRegistrationApiService {

    @Inject
    lateinit var keycloakService: KeycloakService

    @Inject
    lateinit var organizationRegistrationApiService: OrganizationRegistrationApiService

    @Inject
    lateinit var organizationService: OrganizationService

    @Inject
    lateinit var userService: UserService

    @Inject
    lateinit var mdsIdUtils: MdsIdUtils

    fun userRegistrationStatus(userId: String): UserRegistrationStatusResult {
        val user = userService.getUserOrThrow(userId)
        val status = user.registrationStatus.toDto()

        Log.info("User registration status requested. registrationStatus=$status, userId=$userId.")

        return UserRegistrationStatusResult(user.registrationStatus.toDto())
    }

    fun createOrganization(organization: CreateOrganizationRequest, userId: String): IdResponse {
        val mdsId = mdsIdUtils.generateMdsId()

        keycloakService.createOrganization(mdsId)
        keycloakService.joinOrganization(userId, mdsId, OrganizationRole.PARTICIPANT_ADMIN)
        keycloakService.forceLogout(userId)

        organizationService.createOrganization(userId, mdsId, organization, OrganizationRegistrationStatus.PENDING)
        val user = userService.getUserOrThrow(userId)
        val firstUser = user.registrationStatus == UserRegistrationStatus.FIRST_USER
        user.registrationStatus = UserRegistrationStatus.PENDING
        user.organizationMdsId = mdsId
        user.update()

        Log.info("Created organization. mdsId=$mdsId, userId=$userId.")

        if (firstUser) {
            organizationRegistrationApiService.approveOrganization(mdsId, userId)
            Log.info("Approved organization for first user. mdsId=$mdsId, userId=$userId.")
        }

        return IdResponse(mdsId)
    }
}
