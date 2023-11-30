package de.sovity.authorityportal.web.services

import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.db.jooq.tables.records.UserRecord
import de.sovity.authorityportal.web.model.CreateUserData
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import java.time.OffsetDateTime
import org.jooq.DSLContext

@ApplicationScoped
class UserService {

    @Inject
    lateinit var dsl: DSLContext

    fun getUserOrThrow(userId: String): UserRecord {
        return getUser(userId) ?: error("User with id $userId not found")
    }

    fun getUserOrCreate(userId: String): UserRecord {
        return getUser(userId) ?: createUser(userId, UserRegistrationStatus.CREATED)
    }

    fun getUsersByOrganization(mdsId: String): List<UserRecord> {
        val u = Tables.USER

        return dsl.selectFrom(u)
            .where(u.ORGANIZATION_MDS_ID.eq(mdsId))
            .fetch()
            .toList()
    }

    private fun getUser(userId: String): UserRecord? {
        val u = Tables.USER

        return dsl.selectFrom(u)
            .where(u.ID.eq(userId))
            .fetchOne()
    }

    fun createUser(userId: String, registrationStatus: UserRegistrationStatus, mdsId: String? = null): UserRecord {
        return dsl.newRecord(Tables.USER).also {
            it.id = userId
            it.organizationMdsId = mdsId
            it.registrationStatus = registrationStatus
            it.createdAt = OffsetDateTime.now()

            it.insert()
        }
    }

    fun createUser(userId: String, registrationStatus: UserRegistrationStatus,
                   userData: CreateUserData, mdsId: String? = null): UserRecord {
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

            it.insert()
        }
    }
}
