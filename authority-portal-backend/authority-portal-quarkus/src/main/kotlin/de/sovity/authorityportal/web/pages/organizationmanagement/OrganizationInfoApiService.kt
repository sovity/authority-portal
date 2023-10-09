package de.sovity.authorityportal.web.pages.organizationmanagement

import de.sovity.authorityportal.api.model.OrganizationDetailResult
import de.sovity.authorityportal.api.model.OrganizationOverviewEntryDto
import de.sovity.authorityportal.api.model.OrganizationOverviewResult
import de.sovity.authorityportal.web.services.OrganizationService
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class OrganizationInfoApiService {

    @Inject
    lateinit var organizationService: OrganizationService

    fun organizationsOverview(): OrganizationOverviewResult {
        val organizations = organizationService.getOrganizations()

        return OrganizationOverviewResult(organizations.map {
            OrganizationOverviewEntryDto().apply {
                mdsId = it.mdsId
                name = it.name
                url = it.url
                registrationStatus = it.registrationStatus.toDto()
            }
        })
    }

    fun organizationDetails(mdsId: String): OrganizationDetailResult {
        val organization = organizationService.getOrganizationOrThrow(mdsId)

        return OrganizationDetailResult().apply {
            this.mdsId = organization.mdsId
            name = organization.name
            address = organization.address
            duns = organization.duns
            url = organization.url
            securityEmail = organization.securityEmail
            registrationStatus = organization.registrationStatus.toDto()
            createdAt = organization.createdAt
        }
    }
}
