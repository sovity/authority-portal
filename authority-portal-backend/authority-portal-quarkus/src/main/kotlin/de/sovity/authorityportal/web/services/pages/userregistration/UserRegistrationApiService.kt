package de.sovity.authorityportal.web.services.pages.userregistration

import de.sovity.authorityportal.api.model.CreateOrganizationRequest
import de.sovity.authorityportal.api.model.UserRegistrationStatusResult
import de.sovity.authorityportal.web.services.db.OrganizationService
import de.sovity.authorityportal.web.services.thirdparty.keycloak.KeycloakService
import de.sovity.authorityportal.web.services.thirdparty.keycloak.model.OrganizationRole
import de.sovity.authorityportal.web.services.thirdparty.keycloak.model.UserRegistrationStatus
import de.sovity.authorityportal.web.services.utils.MdsIdUtils
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.jooq.DSLContext

@ApplicationScoped
class UserRegistrationApiService {

    @Inject
    lateinit var dsl: DSLContext

    @Inject
    lateinit var keycloakService: KeycloakService

    @Inject
    lateinit var organizationService: OrganizationService

    @Inject
    lateinit var mdsIdUtils: MdsIdUtils

    fun userRegistrationStatus(userId: String): UserRegistrationStatusResult {
        val user = keycloakService.getUser(userId)

        return UserRegistrationStatusResult(user.registrationStatus.toDto())
    }

    fun createOrganization(userId: String, organization: CreateOrganizationRequest): String {
        val mdsId = mdsIdUtils.generateMdsId()
        keycloakService.createOrganization(mdsId)
        keycloakService.joinOrganization(userId, mdsId, OrganizationRole.PARTICIPANT_ADMIN)
        keycloakService.updateStatus(userId, UserRegistrationStatus.PENDING)
        organizationService.createOrganization(userId, mdsId, organization)

        return userId
    }
}
