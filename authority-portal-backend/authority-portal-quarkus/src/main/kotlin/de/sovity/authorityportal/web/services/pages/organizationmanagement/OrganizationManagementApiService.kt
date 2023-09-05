package de.sovity.authorityportal.web.services.pages.organizationmanagement

import de.sovity.authorityportal.api.model.OrganizationDetailResult
import de.sovity.authorityportal.api.model.OrganizationOverviewEntryDto
import de.sovity.authorityportal.api.model.OrganizationOverviewResult
import de.sovity.authorityportal.api.model.UserRegistrationStatusDto
import de.sovity.authorityportal.web.services.db.OrganizationService
import de.sovity.authorityportal.web.services.pages.userapproval.UserApprovalPageApiService
import de.sovity.authorityportal.web.services.pages.userregistration.toDto
import de.sovity.authorityportal.web.services.thirdparty.keycloak.KeycloakService
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class OrganizationManagementApiService {
    @Inject
    lateinit var keycloakService: KeycloakService

    @Inject
    lateinit var organizationService: OrganizationService

    @Inject
    lateinit var userApprovalPageApiService: UserApprovalPageApiService

    fun organizationsOverview(): OrganizationOverviewResult {
        val organizations = organizationService.getOrganizations()

        val organizationDtos = organizations.map {
            OrganizationOverviewEntryDto(
                it.mdsId,
                it.name,
                it.url,
                getOrganizationStatus(it.createdBy)
            )
        }

        return OrganizationOverviewResult(organizationDtos)
    }

    fun organizationDetails(mdsId: String): OrganizationDetailResult {
        val organization = organizationService.getOrganization(mdsId)
            ?: orgNotFound(mdsId)

        return OrganizationDetailResult(
            organization.mdsId,
            organization.name,
            organization.address,
            organization.duns,
            organization.url,
            organization.securityEmail,
            getOrganizationStatus(organization.createdBy)
        )
    }

    fun approveOrganization(mdsId: String): String {
        val userId = organizationService.getOrganization(mdsId)?.createdBy
            ?: orgNotFound(mdsId)

        userApprovalPageApiService.approveUser(userId)
        return mdsId
    }

    fun rejectOrganization(mdsId: String): String {
        val userId = organizationService.getOrganization(mdsId)?.createdBy
            ?: orgNotFound(mdsId)

        userApprovalPageApiService.rejectUser(userId)
        return mdsId
    }

    private fun getOrganizationStatus(userId: String): UserRegistrationStatusDto {
        return keycloakService.getUser(userId).registrationStatus.toDto()
    }

    private fun orgNotFound(mdsId: String): Nothing {
        error("Organization with MDS-ID $mdsId not found")
    }
}
