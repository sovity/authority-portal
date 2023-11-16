package de.sovity.authorityportal.web.pages.organizationmanagement

import de.sovity.authorityportal.api.model.IdResponse
import de.sovity.authorityportal.api.model.UpdateOrganizationDto
import de.sovity.authorityportal.web.services.OrganizationService
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class OrganizationUpdateApiService {

    @Inject
    lateinit var organizationService: OrganizationService

    fun updateOrganizationDetails(mdsId: String, organizationDto: UpdateOrganizationDto): IdResponse {
        val organization = organizationService.getOrganizationOrThrow(mdsId)
        organization.url = organizationDto.url
        organization.businessUnit = organizationDto.businessUnit
        organization.address = organizationDto.address
        organization.billingAddress = organizationDto.billingAddress
        organization.mainContactName = organizationDto.mainContactName
        organization.mainContactEmail = organizationDto.mainContactEmail
        organization.mainContactPhone = organizationDto.mainContactPhone
        organization.techContactName = organizationDto.techContactName
        organization.techContactEmail = organizationDto.techContactEmail
        organization.techContactPhone = organizationDto.techContactPhone
        organization.update()
        return IdResponse(mdsId)
    }

}
