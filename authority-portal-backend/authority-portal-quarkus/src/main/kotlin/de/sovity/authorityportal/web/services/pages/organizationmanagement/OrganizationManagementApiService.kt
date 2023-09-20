package de.sovity.authorityportal.web.services.pages.organizationmanagement

import de.sovity.authorityportal.api.model.IdResponse
import de.sovity.authorityportal.api.model.OrganizationDetailResult
import de.sovity.authorityportal.api.model.OrganizationOverviewEntryDto
import de.sovity.authorityportal.api.model.OrganizationOverviewResult
import de.sovity.authorityportal.db.jooq.enums.OrganizationRegistrationStatus
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.web.services.db.OrganizationService
import de.sovity.authorityportal.web.services.db.UserService
import de.sovity.authorityportal.web.services.utils.unauthorized
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class OrganizationManagementApiService {

    @Inject
    lateinit var organizationService: OrganizationService

    @Inject
    lateinit var userService: UserService

    fun organizationsOverview(): OrganizationOverviewResult {
        val organizations = organizationService.getOrganizations()

        val organizationDtos = organizations.map {
            OrganizationOverviewEntryDto(
                it.mdsId,
                it.name,
                it.url,
                it.registrationStatus.toDto()
            )
        }

        return OrganizationOverviewResult(organizationDtos)
    }

    fun organizationDetails(mdsId: String): OrganizationDetailResult {
        val organization = organizationService.getOrganizationOrThrow(mdsId)

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

    fun approveOrganization(mdsId: String): IdResponse {
        requirePending(mdsId)

        val org = organizationService.getOrganizationOrThrow(mdsId)
        org.registrationStatus = OrganizationRegistrationStatus.APPROVED
        org.update()

        val user = userService.getUserOrThrow(org.createdBy)
        user.registrationStatus = UserRegistrationStatus.APPROVED
        user.update()

        return IdResponse(mdsId)
    }

    fun rejectOrganization(mdsId: String): IdResponse {
        requirePending(mdsId)

        val org = organizationService.getOrganizationOrThrow(mdsId)
        org.registrationStatus = OrganizationRegistrationStatus.REJECTED
        org.update()

        val user = userService.getUserOrThrow(org.createdBy)
        user.registrationStatus = UserRegistrationStatus.REJECTED
        user.update()

        return IdResponse(mdsId)
    }

    private fun requirePending(mdsId: String) {
        val org = organizationService.getOrganizationOrThrow(mdsId)

        if (org.registrationStatus != OrganizationRegistrationStatus.PENDING) {
            unauthorized("Organization $mdsId is not in status PENDING")
        }
    }
}
