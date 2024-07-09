/*
 * Copyright (c) 2024 sovity GmbH
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Contributors:
 *      sovity GmbH - initial implementation
 */

package de.sovity.authorityportal.web.pages.organizationmanagement

import de.sovity.authorityportal.api.model.organization.OrganizationDetailsDto
import de.sovity.authorityportal.api.model.organization.OrganizationLegalIdTypeDto
import de.sovity.authorityportal.api.model.organization.OrganizationOverviewEntryDto
import de.sovity.authorityportal.api.model.organization.OrganizationOverviewResult
import de.sovity.authorityportal.api.model.organization.OwnOrganizationDetailsDto
import de.sovity.authorityportal.db.jooq.tables.records.OrganizationRecord
import de.sovity.authorityportal.web.environment.DeploymentEnvironmentService
import de.sovity.authorityportal.web.services.ConnectorService
import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.services.UserDetailService
import de.sovity.authorityportal.web.services.UserService
import de.sovity.authorityportal.web.services.dataoffer.DataOfferQuery
import jakarta.enterprise.context.ApplicationScoped

@ApplicationScoped
class OrganizationInfoApiService(
    val organizationService: OrganizationService,
    val deploymentEnvironmentService: DeploymentEnvironmentService,
    val userDetailService: UserDetailService,
    val userService: UserService,
    val connectorService: ConnectorService,
    val dataOfferQuery: DataOfferQuery
) {

    fun organizationsOverview(environmentId: String): OrganizationOverviewResult {
        val organizations = organizationService.getOrganizations()
        val connectorCounts = dataOfferQuery.getConnectorCountsByMdsIdsForEnvironment(environmentId)
        val dataOfferCounts = dataOfferQuery.getDataOfferCountsByMdsIdsForEnvironment(environmentId)
        val userCounts = userService.getUserCountsByMdsIds()
        val dtos = organizations.map {
            buildOrganizationOverviewEntryDto(
                organization = it,
                userCounts = userCounts,
                connectorCounts = connectorCounts,
                dataOfferCounts = dataOfferCounts,
            )
        }.sortedBy { it.name }
        return OrganizationOverviewResult(dtos)
    }

    fun organizationsOverviewForProvidingConnectors(
        providerMdsId: String,
        environmentId: String
    ): OrganizationOverviewResult {
        val organizations = organizationsOverview(environmentId).organizations
            .filter { it.mdsId != providerMdsId }
        return OrganizationOverviewResult(organizations)
    }

    private fun buildOrganizationOverviewEntryDto(
        organization: OrganizationRecord,
        userCounts: Map<String, Int>,
        connectorCounts: Map<String, Int>,
        dataOfferCounts: Map<String, Int>,
    ): OrganizationOverviewEntryDto {
        val mdsId = organization.mdsId
        return OrganizationOverviewEntryDto(
            mdsId = mdsId,
            name = organization.name,
            mainContactEmail = organization.mainContactEmail,
            numberOfUsers = userCounts[mdsId] ?: 0,
            numberOfConnectors = connectorCounts[mdsId] ?: 0,
            numberOfDataOffers = dataOfferCounts[mdsId] ?: 0,
            registrationStatus = organization.registrationStatus.toDto()
        )
    }

    fun getOwnOrganizationInformation(mdsId: String): OwnOrganizationDetailsDto {
        val organizationDetails = getOrganizationDetailsDto(mdsId)
        return OwnOrganizationDetailsDto(
            mdsId = organizationDetails.mdsId,
            name = organizationDetails.name,
            registrationStatus = organizationDetails.registrationStatus,
            createdAt = organizationDetails.createdAt,
            createdByUserId = organizationDetails.createdByUserId,
            createdByFirstName = organizationDetails.createdByFirstName,
            createdByLastName = organizationDetails.createdByLastName,

            url = organizationDetails.url,
            description = organizationDetails.description,
            businessUnit = organizationDetails.businessUnit,
            industry = organizationDetails.industry,
            mainAddress = organizationDetails.mainAddress,
            billingAddress = organizationDetails.billingAddress,
            legalIdType = organizationDetails.legalIdType,
            legalId = organizationDetails.legalId,
            commerceRegisterLocation = organizationDetails.commerceRegisterLocation,

            mainContactName = organizationDetails.mainContactName,
            mainContactEmail = organizationDetails.mainContactEmail,
            mainContactPhone = organizationDetails.mainContactPhone,
            techContactName = organizationDetails.techContactName,
            techContactEmail = organizationDetails.techContactEmail,
            techContactPhone = organizationDetails.techContactPhone,

            memberList = organizationDetails.memberList
        )
    }

    fun getOrganizationInformation(mdsId: String, environmentId: String): OrganizationDetailsDto {
        deploymentEnvironmentService.assertValidEnvId(environmentId)

        return getOrganizationDetailsDto(mdsId).also {
            it.connectorCount = connectorService.getConnectorCountByMdsIdAndEnvironment(mdsId, environmentId)
            it.dataOfferCount = dataOfferQuery.getDataOfferCountsForMdsIdAndEnvironment(mdsId, environmentId)
        }
    }

    private fun getOrganizationDetailsDto(mdsId: String): OrganizationDetailsDto {
        val organization = organizationService.getOrganizationOrThrow(mdsId)
        val organizationAdmin = organization.createdBy?.let { userDetailService.getUserData(it) }
        val legalIdType = organization.legalIdType?.toDto()
        val memberList = userDetailService.getOrganizationMembers(mdsId)

        return OrganizationDetailsDto(
            mdsId = organization.mdsId,
            name = organization.name,
            registrationStatus = organization.registrationStatus.toDto(),
            createdAt = organization.createdAt,
            createdByUserId = organizationAdmin?.userId ?: "",
            createdByFirstName = organizationAdmin?.firstName ?: "",
            createdByLastName = organizationAdmin?.lastName ?: "",

            url = organization.url,
            description = organization.description,
            businessUnit = organization.businessUnit,
            industry = organization.industry,
            mainAddress = organization.address,
            billingAddress = organization.billingAddress,
            legalIdType = legalIdType,
            legalId = when (legalIdType) {
                OrganizationLegalIdTypeDto.TAX_ID -> organization.taxId
                OrganizationLegalIdTypeDto.COMMERCE_REGISTER_INFO -> organization.commerceRegisterNumber
                else -> error("Cannot parse LegalIdType. Unknown Enum")
            },
            commerceRegisterLocation = when (legalIdType) {
                OrganizationLegalIdTypeDto.COMMERCE_REGISTER_INFO -> organization.commerceRegisterLocation
                else -> null
            },

            mainContactName = organization.mainContactName,
            mainContactEmail = organization.mainContactEmail,
            mainContactPhone = organization.mainContactPhone,
            techContactName = organization.techContactName,
            techContactEmail = organization.techContactEmail,
            techContactPhone = organization.techContactPhone,

            memberList = memberList,
            memberCount = memberList.size,
            connectorCount = 0,
            dataOfferCount = 0
        )
    }
}
