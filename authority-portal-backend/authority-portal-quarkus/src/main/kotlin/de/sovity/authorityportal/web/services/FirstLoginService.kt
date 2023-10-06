package de.sovity.authorityportal.web.services

import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.db.jooq.tables.records.UserRecord
import jakarta.enterprise.context.ApplicationScoped

@ApplicationScoped
class FirstLoginService {

    fun approveIfInvited(user: UserRecord) {
        if (user.registrationStatus == UserRegistrationStatus.INVITED) {
            user.registrationStatus = UserRegistrationStatus.ACTIVE
            user.update()
        }
    }
}
