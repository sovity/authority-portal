package de.sovity.authorityportal.web.pages.organizationmanagement

import de.sovity.authorityportal.api.model.organization.OrganizationDetailsDto
import de.sovity.authorityportal.api.model.organization.OrganizationOverviewEntryDto
import de.sovity.authorityportal.api.model.organization.OrganizationOverviewResult
import de.sovity.authorityportal.api.model.organization.OwnOrganizationDetailsDto
import de.sovity.authorityportal.web.environment.DeploymentEnvironmentService
import de.sovity.authorityportal.web.services.ConnectorMetadataService
import de.sovity.authorityportal.web.services.ConnectorService
import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.services.UserDetailService
import de.sovity.authorityportal.web.services.UserService
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
    lateinit var userService: UserService

    @Inject
    lateinit var connectorService: ConnectorService

    @Inject
    lateinit var connectorMetadataService: ConnectorMetadataService

    fun organizationsOverview(environmentId: String): OrganizationOverviewResult {
        val organizations = organizationService.getOrganizations()
        val connectorCounts = connectorService.getConnectorCountsByMdsIds(environmentId)
        val userCounts = userService.getUserCountsByMdsIds()
        return OrganizationOverviewResult(organizations.map {
            OrganizationOverviewEntryDto().apply {
                mdsId = it.mdsId
                name = it.name
                mainContactEmail = it.mainContactEmail
                numberOfUsers = userCounts[it.mdsId] ?: 0
                numberOfConnectors = connectorCounts[it.mdsId] ?: 0
                numberOfDataOffers = connectorMetadataService.getTotalDataOffersByMdsId(mdsId, environmentId)
                registrationStatus = it.registrationStatus.toDto()
            }
        })
    }

    fun getOwnOrganizationInformation(mdsId: String): OwnOrganizationDetailsDto {
        val organizationDetails = getOrganizationDetailsDto(mdsId)
        return OwnOrganizationDetailsDto().apply {
            this.mdsId = organizationDetails.mdsId
            name = organizationDetails.name
            businessUnit = organizationDetails.businessUnit
            mainAddress = organizationDetails.mainAddress
            billingAddress = organizationDetails.billingAddress
            taxId = organizationDetails.taxId
            url = organizationDetails.url
            description = organizationDetails.description
            registrationStatus = organizationDetails.registrationStatus
            memberList = organizationDetails.memberList
            adminUserId = organizationDetails.adminUserId
            adminFirstName = organizationDetails.adminFirstName
            adminLastName = organizationDetails.adminLastName
            mainContactName = organizationDetails.mainContactName
            mainContactEmail = organizationDetails.mainContactEmail
            mainContactPhone = organizationDetails.mainContactPhone
            techContactName = organizationDetails.techContactName
            techContactEmail = organizationDetails.techContactEmail
            techContactPhone = organizationDetails.techContactPhone
            createdAt = organizationDetails.createdAt
            createdBy = organizationDetails.createdBy
        }
    }

    fun getOrganizationInformation(mdsId: String, environmentId: String): OrganizationDetailsDto {
        deploymentEnvironmentService.assertValidEnvId(environmentId)

        val organizationDetailsDto = getOrganizationDetailsDto(mdsId)
        organizationDetailsDto.memberCount = organizationDetailsDto.memberList.size
        organizationDetailsDto.connectorCount = connectorService.getConnectorCountByMdsId(mdsId, environmentId)
        organizationDetailsDto.dataOfferCount = connectorMetadataService.getTotalDataOffersByMdsId(mdsId, environmentId)

        return organizationDetailsDto
    }

    private fun getOrganizationDetailsDto(mdsId: String): OrganizationDetailsDto {
        val organization = organizationService.getOrganizationOrThrow(mdsId)
        val organizationAdmin = userDetailService.getUserData(organization.createdBy)
        val organizationDetailsDto = OrganizationDetailsDto().apply {
            this.mdsId = organization.mdsId
            name = organization.name
            businessUnit = organization.businessUnit
            mainAddress = organization.address
            billingAddress = organization.billingAddress
            taxId = organization.taxId
            url = organization.url
            description = "[Placeholder]"
            registrationStatus = organization.registrationStatus.toDto()
            memberList = userDetailService.getOrganizationMembers(mdsId)
            adminUserId = organizationAdmin.userId
            adminFirstName = organizationAdmin.firstName
            adminLastName = organizationAdmin.lastName
            mainContactName = organization.mainContactName
            mainContactEmail = organization.mainContactEmail
            mainContactPhone = organization.mainContactPhone
            techContactName = organization.techContactName
            techContactEmail = organization.techContactEmail
            techContactPhone = organization.techContactPhone
            createdAt = organization.createdAt
            createdBy = organization.createdBy
        }

        return organizationDetailsDto
    }
}
