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
package de.sovity.authorityportal.web.services

import de.sovity.authorityportal.api.model.UpdateOrganizationDto
import de.sovity.authorityportal.api.model.organization.OnboardingOrganizationUpdateDto
import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.enums.OrganizationLegalIdType
import de.sovity.authorityportal.db.jooq.enums.OrganizationRegistrationStatus
import de.sovity.authorityportal.db.jooq.tables.records.OrganizationRecord
import de.sovity.authorityportal.web.model.CreateOrganizationData
import de.sovity.authorityportal.web.pages.organizationmanagement.toDb
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.jooq.DSLContext
import java.time.OffsetDateTime

@ApplicationScoped
class OrganizationService {

    @Inject
    lateinit var dsl: DSLContext

    fun getOrganizationOrThrow(mdsId: String): OrganizationRecord {
        return getOrganization(mdsId) ?: error("Organization with id $mdsId not found")
    }

    private fun getOrganization(mdsId: String): OrganizationRecord? {
        val o = Tables.ORGANIZATION

        return dsl.selectFrom(o)
            .where(o.MDS_ID.eq(mdsId))
            .fetchOne()
    }

    fun getOrganizations(): List<OrganizationRecord> {
        val o = Tables.ORGANIZATION

        return dsl.selectFrom(o)
            .fetch()
    }

    /**
     * Returns a map of all organizations with their MDS ID as key and their name as value.
     */
    fun getAllOrganizationNames(): Map<String, String> {
        val o = Tables.ORGANIZATION

        return dsl.select(o.MDS_ID, o.NAME)
            .from(o)
            .fetchMap(o.MDS_ID, o.NAME)
    }

    fun createInvitedOrganization(
        userId: String,
        mdsId: String,
        orgName: String
    ) {
        dsl.newRecord(Tables.ORGANIZATION).also {
            it.mdsId = mdsId
            it.name = orgName
            it.createdBy = userId
            it.registrationStatus = OrganizationRegistrationStatus.INVITED
            it.createdAt = OffsetDateTime.now()

            it.insert()
        }
    }

    fun createOrganization(
        userId: String,
        mdsId: String,
        organizationData: CreateOrganizationData,
        registrationStatus: OrganizationRegistrationStatus
    ) {
        val legalIdType = organizationData.legalIdType
        dsl.newRecord(Tables.ORGANIZATION).also {
            it.mdsId = mdsId
            it.name = organizationData.name
            it.registrationStatus = registrationStatus
            it.createdAt = OffsetDateTime.now()
            it.createdBy = userId

            it.url = organizationData.url
            it.description = organizationData.description
            it.businessUnit = organizationData.businessUnit
            it.industry = organizationData.industry
            it.address = organizationData.address
            it.billingAddress = organizationData.billingAddress
            updateLegalId(it, legalIdType, organizationData.legalIdNumber, organizationData.commerceRegisterLocation)

            it.mainContactName = organizationData.mainContactName
            it.mainContactEmail = organizationData.mainContactEmail
            it.mainContactPhone = organizationData.mainContactPhone
            it.techContactName = organizationData.techContactName
            it.techContactEmail = organizationData.techContactEmail
            it.techContactPhone = organizationData.techContactPhone

            it.insert()
        }
    }

    fun updateOrganization(mdsId: String, dto: UpdateOrganizationDto) {
        val organization = getOrganizationOrThrow(mdsId)
        organization.url = dto.url
        organization.description = dto.description
        organization.businessUnit = dto.businessUnit
        organization.industry = dto.industry
        organization.address = dto.address
        organization.billingAddress = dto.billingAddress

        organization.mainContactName = dto.mainContactName
        organization.mainContactEmail = dto.mainContactEmail
        organization.mainContactPhone = dto.mainContactPhone
        organization.techContactName = dto.techContactName
        organization.techContactEmail = dto.techContactEmail
        organization.techContactPhone = dto.techContactPhone
        organization.update()
    }

    fun onboardOrganization(mdsId: String, dto: OnboardingOrganizationUpdateDto) {
        val organization = getOrganizationOrThrow(mdsId)
        organization.name = dto.name
        organization.registrationStatus = OrganizationRegistrationStatus.ACTIVE
        organization.createdAt = OffsetDateTime.now()

        organization.url = dto.url
        organization.description = dto.description
        organization.businessUnit = dto.businessUnit
        organization.industry = dto.industry
        organization.address = dto.address
        organization.billingAddress = dto.billingAddress
        updateLegalId(organization, dto.legalIdType.toDb(), dto.legalIdNumber, dto.commerceRegisterLocation)

        organization.mainContactName = dto.mainContactName
        organization.mainContactEmail = dto.mainContactEmail
        organization.mainContactPhone = dto.mainContactPhone
        organization.techContactName = dto.techContactName
        organization.techContactEmail = dto.techContactEmail
        organization.techContactPhone = dto.techContactPhone

        organization.update()
    }

    private fun updateLegalId(
        organization: OrganizationRecord,
        legalIdType: OrganizationLegalIdType?,
        legalIdNumber: String?,
        commerceRegisterLocation: String?
    ) {
        organization.legalIdType = legalIdType
        organization.taxId = legalIdNumber.takeIf { legalIdType == OrganizationLegalIdType.TAX_ID }
        organization.commerceRegisterNumber = legalIdNumber.takeIf { legalIdType == OrganizationLegalIdType.COMMERCE_REGISTER_INFO }
        organization.commerceRegisterLocation = commerceRegisterLocation.takeIf { legalIdType == OrganizationLegalIdType.COMMERCE_REGISTER_INFO }
    }

    fun deleteOrganization(mdsId: String) {
        val o = Tables.ORGANIZATION

        dsl.deleteFrom(o)
            .where(o.MDS_ID.eq(mdsId))
            .execute()
    }

    fun getUnconfirmedOrganizationMdsIds(expirationCutoffTime: OffsetDateTime): List<String> {
        val o = Tables.ORGANIZATION

        return dsl.select(o.MDS_ID)
            .from(o)
            .where(o.REGISTRATION_STATUS.eq(OrganizationRegistrationStatus.INVITED))
            .and(o.CREATED_AT.lt(expirationCutoffTime))
            .fetch(o.MDS_ID)
    }

    fun deleteUnconfirmedOrganizations(mdsIds: List<String>): Int {
        val o = Tables.ORGANIZATION

        return dsl.deleteFrom(o)
            .where(o.MDS_ID.`in`(mdsIds))
            .execute()
    }

    fun updateStatus(mdsId: String, status: OrganizationRegistrationStatus) {
        val o = Tables.ORGANIZATION

        dsl.update(o)
            .set(o.REGISTRATION_STATUS, status)
            .where(o.MDS_ID.eq(mdsId))
            .execute()
    }
}
