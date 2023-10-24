package de.sovity.authorityportal.web.pages.organizationmanagement

import de.sovity.authorityportal.api.model.OrganizationDetailsDto
import de.sovity.authorityportal.api.model.OrganizationOverviewEntryDto
import de.sovity.authorityportal.api.model.OrganizationOverviewResult
import de.sovity.authorityportal.api.model.OwnOrganizationDetailsDto
import de.sovity.authorityportal.web.services.ConnectorService
import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.services.UserDetailService
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class OrganizationInfoApiService {

    @Inject
    lateinit var organizationService: OrganizationService

    @Inject
    lateinit var userDetailService: UserDetailService

    @Inject
    lateinit var connectorService: ConnectorService

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

    fun ownOrganizationDetails(mdsId: String): OwnOrganizationDetailsDto {
        val organizationDetails = getOrganizationDetailsDto(mdsId, false)
        return OwnOrganizationDetailsDto(
            organizationDetails.mdsId,
            organizationDetails.name,
            organizationDetails.address,
            organizationDetails.duns,
            organizationDetails.url,
            organizationDetails.securityEmail,
            organizationDetails.registrationStatus,
            organizationDetails.createdAt,
            organizationDetails.memberInfos
        )
    }

    fun getOrganizationInformation(mdsId: String): OrganizationDetailsDto {
        return getOrganizationDetailsDto(mdsId, true);
    }

    private fun getOrganizationDetailsDto(mdsId: String, includeCounts: Boolean): OrganizationDetailsDto {
        val organization = organizationService.getOrganizationOrThrow(mdsId)
        val organizationDetailsDto = OrganizationDetailsDto().apply {
            this.mdsId = organization.mdsId
            name = organization.name
            address = organization.address
            duns = organization.duns
            url = organization.url
            securityEmail = organization.securityEmail
            registrationStatus = organization.registrationStatus.toDto()
            createdAt = organization.createdAt
        }
        organizationDetailsDto.memberInfos = userDetailService.getOrganizationMembers(mdsId)
        if (includeCounts) {
            organizationDetailsDto.memberCount = organizationDetailsDto.memberInfos.size
            organizationDetailsDto.connectorCount = connectorService.getConnectorsCountByMdsId(mdsId)
        }
        return organizationDetailsDto
    }
}
