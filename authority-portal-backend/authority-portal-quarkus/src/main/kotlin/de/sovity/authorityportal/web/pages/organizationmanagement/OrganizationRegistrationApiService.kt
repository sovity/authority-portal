package de.sovity.authorityportal.web.pages.organizationmanagement

import de.sovity.authorityportal.api.model.IdResponse
import de.sovity.authorityportal.db.jooq.enums.OrganizationRegistrationStatus
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.services.UserService
import de.sovity.authorityportal.web.utils.unauthorized
import io.quarkus.logging.Log
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class OrganizationRegistrationApiService {

    @Inject
    lateinit var organizationService: OrganizationService

    @Inject
    lateinit var userService: UserService

    fun approveOrganization(mdsId: String, userId: String): IdResponse {
        requirePending(mdsId, userId)

        val org = organizationService.getOrganizationOrThrow(mdsId)
        org.registrationStatus = OrganizationRegistrationStatus.ACTIVE
        org.update()

        val user = userService.getUserOrThrow(org.createdBy)
        user.registrationStatus = UserRegistrationStatus.ACTIVE
        user.update()

        Log.info("Approved organization and user. mdsId=$mdsId, userId=$userId.")

        return IdResponse(mdsId)
    }

    fun rejectOrganization(mdsId: String, userId: String): IdResponse {
        requirePending(mdsId, userId)

        val org = organizationService.getOrganizationOrThrow(mdsId)
        org.registrationStatus = OrganizationRegistrationStatus.REJECTED
        org.update()

        val user = userService.getUserOrThrow(org.createdBy)
        user.registrationStatus = UserRegistrationStatus.REJECTED
        user.update()

        Log.info("Rejected organization and user. mdsId=$mdsId, userId=$userId.")

        return IdResponse(mdsId)
    }

    private fun requirePending(mdsId: String, userId: String) {
        val org = organizationService.getOrganizationOrThrow(mdsId)
        val orgRegistrationStatus = org.registrationStatus
        val expectedRegistrationStatus = OrganizationRegistrationStatus.PENDING

        if (orgRegistrationStatus != expectedRegistrationStatus) {
            Log.error("Organization can not be approved/rejected. mdsId=$mdsId, orgRegistrationStatus=$orgRegistrationStatus, expectedRegistrationStatus=$expectedRegistrationStatus, userId=$userId.")
            unauthorized("Organization $mdsId is not in status PENDING")
        }
    }
}
