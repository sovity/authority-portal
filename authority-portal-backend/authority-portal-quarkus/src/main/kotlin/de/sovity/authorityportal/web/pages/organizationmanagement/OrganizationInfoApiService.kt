package de.sovity.authorityportal.web.pages.organizationmanagement

import de.sovity.authorityportal.api.model.organization.OrganizationDetailsDto
import de.sovity.authorityportal.api.model.organization.OrganizationLegalIdTypeDto
import de.sovity.authorityportal.api.model.organization.OrganizationOverviewEntryDto
import de.sovity.authorityportal.api.model.organization.OrganizationOverviewResult
import de.sovity.authorityportal.api.model.organization.OwnOrganizationDetailsDto
import de.sovity.authorityportal.db.jooq.tables.records.OrganizationRecord
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
        val connectorCounts = connectorService.getConnectorCountsByMdsIdsForEnvironment(environmentId)
        val userCounts = userService.getUserCountsByMdsIds()
        val dtos = organizations.map {
            buildOrganizationOverviewEntryDto(it, userCounts, connectorCounts, environmentId)
        }
        return OrganizationOverviewResult(dtos)
    }

    private fun buildOrganizationOverviewEntryDto(
        organization: OrganizationRecord,
        userCounts: Map<String, Int>,
        connectorCounts: Map<String, Int>,
        environmentId: String
    ): OrganizationOverviewEntryDto {
        val mdsId = organization.mdsId
        val dto = OrganizationOverviewEntryDto()
        dto.mdsId = mdsId
        dto.name = organization.name
        dto.mainContactEmail = organization.mainContactEmail
        dto.numberOfUsers = userCounts[mdsId] ?: 0
        dto.numberOfConnectors = connectorCounts[mdsId] ?: 0
        dto.numberOfDataOffers = connectorMetadataService.getTotalDataOffersByMdsId(mdsId, environmentId)
        dto.registrationStatus = organization.registrationStatus.toDto()
        return dto
    }

    fun getOwnOrganizationInformation(mdsId: String): OwnOrganizationDetailsDto {
        val organizationDetails = getOrganizationDetailsDto(mdsId)
        val dto = OwnOrganizationDetailsDto()
        dto.mdsId = organizationDetails.mdsId
        dto.name = organizationDetails.name
        dto.registrationStatus = organizationDetails.registrationStatus
        dto.createdAt = organizationDetails.createdAt
        dto.createdByUserId = organizationDetails.createdByUserId
        dto.createdByFirstName = organizationDetails.createdByFirstName
        dto.createdByLastName = organizationDetails.createdByLastName

        dto.url = organizationDetails.url
        dto.description = organizationDetails.description
        dto.businessUnit = organizationDetails.businessUnit
        dto.industry = organizationDetails.industry
        dto.mainAddress = organizationDetails.mainAddress
        dto.billingAddress = organizationDetails.billingAddress
        dto.legalIdType = organizationDetails.legalIdType
        dto.legalId = organizationDetails.legalId
        dto.commerceRegisterLocation = organizationDetails.commerceRegisterLocation

        dto.mainContactName = organizationDetails.mainContactName
        dto.mainContactEmail = organizationDetails.mainContactEmail
        dto.mainContactPhone = organizationDetails.mainContactPhone
        dto.techContactName = organizationDetails.techContactName
        dto.techContactEmail = organizationDetails.techContactEmail
        dto.techContactPhone = organizationDetails.techContactPhone

        dto.memberList = organizationDetails.memberList
        return dto
    }

    fun getOrganizationInformation(mdsId: String, environmentId: String): OrganizationDetailsDto {
        deploymentEnvironmentService.assertValidEnvId(environmentId)

        val organizationDetailsDto = getOrganizationDetailsDto(mdsId)
        organizationDetailsDto.memberCount = organizationDetailsDto.memberList.size
        organizationDetailsDto.connectorCount = connectorService.getConnectorCountByMdsIdAndEnvironment(mdsId, environmentId)
        organizationDetailsDto.dataOfferCount = connectorMetadataService.getTotalDataOffersByMdsId(mdsId, environmentId)

        return organizationDetailsDto
    }

    private fun getOrganizationDetailsDto(mdsId: String): OrganizationDetailsDto {
        val organization = organizationService.getOrganizationOrThrow(mdsId)
        val organizationAdmin = organization.createdBy?.let { userDetailService.getUserData(it) }

        val dto = OrganizationDetailsDto()
        dto.mdsId = organization.mdsId
        dto.name = organization.name
        dto.registrationStatus = organization.registrationStatus.toDto()
        dto.createdAt = organization.createdAt
        dto.createdByUserId = organizationAdmin?.userId
        dto.createdByFirstName = organizationAdmin?.firstName
        dto.createdByLastName = organizationAdmin?.lastName

        dto.url = organization.url
        dto.description = organization.description
        dto.businessUnit = organization.businessUnit
        dto.industry = organization.industry
        dto.mainAddress = organization.address
        dto.billingAddress = organization.billingAddress
        dto.legalIdType = organization.legalIdType?.toDto()
        dto.legalId = when (dto.legalIdType) {
            OrganizationLegalIdTypeDto.TAX_ID -> organization.taxId
            OrganizationLegalIdTypeDto.COMMERCE_REGISTER_INFO -> organization.commerceRegisterNumber
            else -> null
        }
        dto.commerceRegisterLocation = when (dto.legalIdType) {
            OrganizationLegalIdTypeDto.COMMERCE_REGISTER_INFO -> organization.commerceRegisterLocation
            else -> null
        }

        dto.mainContactName = organization.mainContactName
        dto.mainContactEmail = organization.mainContactEmail
        dto.mainContactPhone = organization.mainContactPhone
        dto.techContactName = organization.techContactName
        dto.techContactEmail = organization.techContactEmail
        dto.techContactPhone = organization.techContactPhone

        dto.memberList = userDetailService.getOrganizationMembers(mdsId)
        return dto
    }
}
