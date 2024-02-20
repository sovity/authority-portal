package de.sovity.authorityportal.web.services

import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.enums.OrganizationLegalIdType
import de.sovity.authorityportal.db.jooq.enums.OrganizationRegistrationStatus
import de.sovity.authorityportal.db.jooq.tables.records.OrganizationRecord
import de.sovity.authorityportal.web.model.CreateOrganizationData
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
        dsl.newRecord(Tables.ORGANIZATION).also {
            it.mdsId = mdsId
            it.name = organizationData.name
            it.url = organizationData.url
            it.businessUnit = organizationData.businessUnit
            it.address = organizationData.address
            it.billingAddress = organizationData.billingAddress
            it.legalIdType = organizationData.legalIdType
            it.taxId = if (it.legalIdType == OrganizationLegalIdType.TAX_ID) organizationData.legalIdNumber else null
            it.commerceRegisterNumber = if (it.legalIdType == OrganizationLegalIdType.COMMERCE_REGISTER_INFO) organizationData.legalIdNumber else null
            it.commerceRegisterLocation = organizationData.commerceRegisterLocation
            it.mainContactName = organizationData.mainContactName
            it.mainContactEmail = organizationData.mainContactEmail
            it.mainContactPhone = organizationData.mainContactPhone
            it.techContactName = organizationData.techContactName
            it.techContactEmail = organizationData.techContactEmail
            it.techContactPhone = organizationData.techContactPhone
            it.createdBy = userId
            it.registrationStatus = registrationStatus
            it.createdAt = OffsetDateTime.now()

            it.insert()
        }
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
