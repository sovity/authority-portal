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
        return getUser(userId) ?: createUser(userId, UserRegistrationStatus.CREATED, onboardingType = userOnboardingType)
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

    fun createUser(userId: String, registrationStatus: UserRegistrationStatus, mdsId: String? = null, onboardingType: UserOnboardingType, invitedBy: String? = null): UserRecord {
        return dsl.newRecord(Tables.USER).also {
            it.id = userId
            it.organizationMdsId = mdsId
            it.registrationStatus = registrationStatus
            it.createdAt = OffsetDateTime.now()
            it.onboardingType = onboardingType
            it.invitedBy = invitedBy

            it.insert()
        }
    }

    fun createUser(userId: String, registrationStatus: UserRegistrationStatus,
                   userData: CreateUserData, mdsId: String? = null, onboardingType: UserOnboardingType): UserRecord {
        return dsl.newRecord(Tables.USER).also {
            it.id = userId
            it.email = userData.email
            it.firstName = userData.firstName
            it.lastName = userData.lastName
            it.jobTitle = userData.jobTitle
            it.phone = userData.phone
            it.organizationMdsId = mdsId
            it.registrationStatus = registrationStatus
            it.createdAt = OffsetDateTime.now()
            it.onboardingType = onboardingType

            it.insert()
        }
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
}
