package de.sovity.authorityportal.web.pages.organizationmanagement

import de.sovity.authorityportal.api.model.OrganizationDetailsDto
import de.sovity.authorityportal.api.model.OrganizationOverviewEntryDto
import de.sovity.authorityportal.api.model.OrganizationOverviewResult
import de.sovity.authorityportal.api.model.OwnOrganizationDetailsDto
import de.sovity.authorityportal.web.environment.DeploymentEnvironmentService
import de.sovity.authorityportal.web.services.ConnectorService
import de.sovity.authorityportal.web.services.DataOfferCountService
import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.services.UserDetailService
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class OrganizationInfoApiService {

    @Inject
    lateinit var organizationService: OrganizationService

    @Inject
    lateinit var deploymentEnvironmentService: DeploymentEnvironmentService

    @Inject
    lateinit var userDetailService: UserDetailService

    @Inject
    lateinit var connectorService: ConnectorService

    @Inject
    lateinit var dataOfferCountService: DataOfferCountService

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
        val organizationDetails = getOrganizationDetailsDto(mdsId)
        return OwnOrganizationDetailsDto(
            organizationDetails.mdsId,
            organizationDetails.name,
            organizationDetails.address,
            organizationDetails.taxId,
            organizationDetails.url,
            organizationDetails.securityEmail,
            organizationDetails.registrationStatus,
            organizationDetails.createdAt,
            organizationDetails.createdBy,
            organizationDetails.memberInfos
        )
    }

    fun getOrganizationInformation(mdsId: String, environmentId: String): OrganizationDetailsDto {
        deploymentEnvironmentService.assertValidEnvId(environmentId)

        val organizationDetailsDto = getOrganizationDetailsDto(mdsId)
        organizationDetailsDto.memberCount = organizationDetailsDto.memberInfos.size
        organizationDetailsDto.connectorCount = connectorService.getConnectorCountByMdsId(mdsId, environmentId)
        organizationDetailsDto.dataOfferCount = dataOfferCountService.getTotalDataOffersByMdsId(mdsId, environmentId)

        return organizationDetailsDto;
    }

    private fun getOrganizationDetailsDto(mdsId: String): OrganizationDetailsDto {
        val organization = organizationService.getOrganizationOrThrow(mdsId)
        val organizationDetailsDto = OrganizationDetailsDto().apply {
            this.mdsId = organization.mdsId
            name = organization.name
            address = organization.address
            taxId = organization.taxId
            url = organization.url
            securityEmail = organization.mainContactEmail
            registrationStatus = organization.registrationStatus.toDto()
            createdAt = organization.createdAt
            createdBy = organization.createdBy
        }
        organizationDetailsDto.memberInfos = userDetailService.getOrganizationMembers(mdsId)

        return organizationDetailsDto
    }
}
