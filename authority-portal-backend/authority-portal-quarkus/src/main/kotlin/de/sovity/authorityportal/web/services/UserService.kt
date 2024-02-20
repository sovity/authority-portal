package de.sovity.authorityportal.web.services

import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.enums.UserOnboardingType
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.db.jooq.tables.records.UserRecord
import de.sovity.authorityportal.web.model.CreateUserData
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.jooq.DSLContext
import org.jooq.impl.DSL
import java.time.OffsetDateTime

@ApplicationScoped
class UserService {

    @Inject
    lateinit var dsl: DSLContext

    fun getUserOrThrow(userId: String): UserRecord {
        return getUser(userId) ?: error("User with id $userId not found")
    }

    fun getUserOrCreate(userId: String, userOnboardingType: UserOnboardingType): UserRecord {
        return getUser(userId) ?: createUser(userId, onboardingType = userOnboardingType)
    }

    fun getUsersByMdsId(mdsId: String): List<UserRecord> {
        val u = Tables.USER

        return dsl.selectFrom(u)
            .where(u.ORGANIZATION_MDS_ID.eq(mdsId))
            .fetch()
            .toList()
    }

    fun getUserCountsByMdsIds(): Map<String, Int> {
        val u = Tables.USER

        return dsl.select(u.ORGANIZATION_MDS_ID, DSL.count())
            .from(u)
            .groupBy(u.ORGANIZATION_MDS_ID)
            .fetchMap(u.ORGANIZATION_MDS_ID, DSL.count())
    }

    private fun getUser(userId: String): UserRecord? {
        val u = Tables.USER

        return dsl.selectFrom(u)
            .where(u.ID.eq(userId))
            .fetchOne()
    }

    fun createUser(userId: String, mdsId: String? = null, onboardingType: UserOnboardingType, invitedBy: String? = null): UserRecord {
        return dsl.newRecord(Tables.USER).also {
            it.id = userId
            it.organizationMdsId = mdsId
            it.registrationStatus = initialRegistrationStatus(onboardingType)
            it.createdAt = OffsetDateTime.now()
            it.onboardingType = onboardingType
            it.invitedBy = invitedBy

            it.insert()
        }
    }

    fun createUser(
        userId: String,
        userData: CreateUserData,
        mdsId: String? = null,
        onboardingType: UserOnboardingType
    ): UserRecord {
        return dsl.newRecord(Tables.USER).also {
            it.id = userId
            it.email = userData.email
            it.firstName = userData.firstName
            it.lastName = userData.lastName
            it.jobTitle = userData.jobTitle
            it.phone = userData.phone
            it.organizationMdsId = mdsId
            it.registrationStatus = initialRegistrationStatus(onboardingType)
            it.createdAt = OffsetDateTime.now()
            it.onboardingType = onboardingType

            it.insert()
        }
    }

    private fun initialRegistrationStatus(onboardingType: UserOnboardingType): UserRegistrationStatus? =
        when (onboardingType) {
            UserOnboardingType.SELF_REGISTRATION -> UserRegistrationStatus.PENDING
            UserOnboardingType.INVITATION -> UserRegistrationStatus.INVITED
        }

    fun deleteUser(userId: String) {
        val u = Tables.USER

        dsl.deleteFrom(u)
            .where(u.ID.eq(userId))
            .execute()
    }

    fun deleteUsersByMdsId(mdsId: String) {
        val u = Tables.USER

        dsl.deleteFrom(u)
            .where(u.ORGANIZATION_MDS_ID.eq(mdsId))
            .execute()
    }

    fun getUnconfirmedUserIds(expirationTime: OffsetDateTime): List<String> {
        val u = Tables.USER

        return dsl.select(u.ID)
            .from(u)
            .where(u.REGISTRATION_STATUS.eq(UserRegistrationStatus.INVITED))
            .and(u.CREATED_AT.lt(expirationTime))
            .fetch(u.ID)
    }

    fun removeMdsIdFromUnconfirmedUsers(expirationCutoffTime: OffsetDateTime) {
        val u = Tables.USER

        dsl.update(u)
            .setNull(u.ORGANIZATION_MDS_ID)
            .where(u.REGISTRATION_STATUS.eq(UserRegistrationStatus.INVITED))
            .and(u.CREATED_AT.lt(expirationCutoffTime))
            .execute()
    }

    fun deleteUnconfirmedUsers(userIds: List<String>): Int {
        val u = Tables.USER

        return dsl.deleteFrom(u)
            .where(u.ID.`in`(userIds))
            .execute()
    }

    fun deleteInvitationReference(invitedBy: String) {
        val u = Tables.USER

        dsl.update(u)
            .setNull(u.INVITED_BY)
            .where(u.INVITED_BY.eq(invitedBy))
            .execute()
    }

    fun deleteInvitationReferencesToOrgMembers(orgMemberIds: List<String>) {
        val u = Tables.USER

        dsl.update(u)
            .setNull(u.INVITED_BY)
            .where(u.INVITED_BY.`in`(orgMemberIds))
            .execute()
    }

    fun deleteMdsIds(orgMemberIds: List<String>) {
        val u = Tables.USER

        dsl.update(u)
            .setNull(u.ORGANIZATION_MDS_ID)
            .where(u.ID.`in`(orgMemberIds))
            .execute()
    }

    fun updateStatus(userId: String, status: UserRegistrationStatus) {
        val u = Tables.USER

        dsl.update(u)
            .set(u.REGISTRATION_STATUS, status)
            .where(u.ID.eq(userId))
            .execute()
    }
}
