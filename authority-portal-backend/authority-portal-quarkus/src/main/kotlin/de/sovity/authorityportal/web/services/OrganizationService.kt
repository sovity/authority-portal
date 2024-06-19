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
import de.sovity.authorityportal.broker.dao.utils.eqAny
import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.enums.OrganizationLegalIdType
import de.sovity.authorityportal.db.jooq.enums.OrganizationRegistrationStatus
import de.sovity.authorityportal.db.jooq.tables.records.OrganizationRecord
import de.sovity.authorityportal.web.model.CreateOrganizationData
import de.sovity.authorityportal.web.pages.organizationmanagement.toDb
import de.sovity.authorityportal.web.utils.TimeUtils
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.jooq.DSLContext
import java.time.OffsetDateTime

@ApplicationScoped
class OrganizationService(
    val dsl: DSLContext,
    val timeUtils: TimeUtils
) {

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
            it.name = orgName.trim()
            it.createdBy = userId
            it.registrationStatus = OrganizationRegistrationStatus.INVITED
            it.createdAt = timeUtils.now()

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
            it.name = organizationData.name?.trim()
            it.registrationStatus = registrationStatus
            it.createdAt = timeUtils.now()
            it.createdBy = userId

            it.url = organizationData.url?.trim()
            it.description = organizationData.description?.trim()
            it.businessUnit = organizationData.businessUnit?.trim()
            it.industry = organizationData.industry?.trim()
            it.address = organizationData.address?.trim()
            it.billingAddress = organizationData.billingAddress?.trim()
            updateLegalId(it, legalIdType, organizationData.legalIdNumber, organizationData.commerceRegisterLocation)

            it.mainContactName = organizationData.mainContactName?.trim()
            it.mainContactEmail = organizationData.mainContactEmail?.trim()
            it.mainContactPhone = organizationData.mainContactPhone?.trim()
            it.techContactName = organizationData.techContactName?.trim()
            it.techContactEmail = organizationData.techContactEmail?.trim()
            it.techContactPhone = organizationData.techContactPhone?.trim()

            it.insert()
        }
    }

    fun updateOrganization(mdsId: String, dto: UpdateOrganizationDto) {
        val organization = getOrganizationOrThrow(mdsId)
        organization.url = dto.url.trim()
        organization.description = dto.description.trim()
        organization.businessUnit = dto.businessUnit.trim()
        organization.industry = dto.industry.trim()
        organization.address = dto.address.trim()
        organization.billingAddress = dto.billingAddress.trim()

        organization.mainContactName = dto.mainContactName.trim()
        organization.mainContactEmail = dto.mainContactEmail.trim()
        organization.mainContactPhone = dto.mainContactPhone.trim()
        organization.techContactName = dto.techContactName.trim()
        organization.techContactEmail = dto.techContactEmail.trim()
        organization.techContactPhone = dto.techContactPhone.trim()
        organization.update()
    }

    fun onboardOrganization(mdsId: String, dto: OnboardingOrganizationUpdateDto) {
        val organization = getOrganizationOrThrow(mdsId)
        organization.name = dto.name.trim()
        organization.registrationStatus = OrganizationRegistrationStatus.ACTIVE
        organization.createdAt = timeUtils.now()

        organization.url = dto.url.trim()
        organization.description = dto.description.trim()
        organization.businessUnit = dto.businessUnit.trim()
        organization.industry = dto.industry
        organization.address = dto.address.trim()
        organization.billingAddress = dto.billingAddress.trim()
        updateLegalId(organization, dto.legalIdType.toDb(), dto.legalIdNumber, dto.commerceRegisterLocation)

        organization.mainContactName = dto.mainContactName.trim()
        organization.mainContactEmail = dto.mainContactEmail.trim()
        organization.mainContactPhone = dto.mainContactPhone.trim()
        organization.techContactName = dto.techContactName.trim()
        organization.techContactEmail = dto.techContactEmail.trim()
        organization.techContactPhone = dto.techContactPhone.trim()

        organization.update()
    }

    private fun updateLegalId(
        organization: OrganizationRecord,
        legalIdType: OrganizationLegalIdType?,
        legalIdNumber: String?,
        commerceRegisterLocation: String?
    ) {
        organization.legalIdType = legalIdType
        organization.taxId = legalIdNumber.takeIf { legalIdType == OrganizationLegalIdType.TAX_ID }?.trim()
        organization.commerceRegisterNumber = legalIdNumber.takeIf { legalIdType == OrganizationLegalIdType.COMMERCE_REGISTER_INFO }?.trim()
        organization.commerceRegisterLocation = commerceRegisterLocation.takeIf { legalIdType == OrganizationLegalIdType.COMMERCE_REGISTER_INFO }?.trim()
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
            .where(o.MDS_ID.eqAny(mdsIds))
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
