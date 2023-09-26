package de.sovity.authorityportal.web.pages.organizationmanagement

import de.sovity.authorityportal.api.model.IdResponse
import de.sovity.authorityportal.api.model.OrganizationDetailResult
import de.sovity.authorityportal.api.model.OrganizationOverviewEntryDto
import de.sovity.authorityportal.api.model.OrganizationOverviewResult
import de.sovity.authorityportal.db.jooq.enums.OrganizationRegistrationStatus
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.services.UserService
import de.sovity.authorityportal.web.utils.unauthorized
import io.quarkus.logging.Log
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class OrganizationManagementApiService {

    @Inject
    lateinit var organizationService: OrganizationService

    @Inject
    lateinit var userService: UserService

    fun organizationsOverview(userId: String): OrganizationOverviewResult {
        val organizations = organizationService.getOrganizations()

        val organizationDtos = organizations.map {
            OrganizationOverviewEntryDto(
                it.mdsId,
                it.name,
                it.url,
                it.registrationStatus.toDto()
            )
        }

        Log.info("Organization list requested. userId=$userId.")

        return OrganizationOverviewResult(organizationDtos)
    }

    fun organizationDetails(mdsId: String, userId: String): OrganizationDetailResult {
        val organization = organizationService.getOrganizationOrThrow(mdsId)

        Log.info("Organization details requested. mdsId=$mdsId, userId=$userId.")

        return OrganizationDetailResult(
            organization.mdsId,
            organization.name,
            organization.address,
            organization.duns,
            organization.url,
            organization.securityEmail,
            organization.registrationStatus.toDto()
        )
    }

    fun approveOrganization(mdsId: String, userId: String): IdResponse {
        requirePending(mdsId, userId)

        val org = organizationService.getOrganizationOrThrow(mdsId)
        org.registrationStatus = OrganizationRegistrationStatus.APPROVED
        org.update()

        val user = userService.getUserOrThrow(org.createdBy)
        user.registrationStatus = UserRegistrationStatus.APPROVED
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
