package de.sovity.authorityportal.web.pages.usermanagement

import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.services.UserService
import de.sovity.authorityportal.web.thirdparty.keycloak.KeycloakService
import io.quarkus.logging.Log
import io.quarkus.scheduler.Scheduled
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.transaction.Transactional
import org.eclipse.microprofile.config.inject.ConfigProperty
import java.time.OffsetDateTime

@ApplicationScoped
class UnconfirmedUserDeletionService {

    @Inject
    lateinit var userService: UserService

    @Inject
    lateinit var keycloakService: KeycloakService

    @Inject
    lateinit var organizationService: OrganizationService

    @ConfigProperty(name = "authority-portal.invitation.expiration")
    lateinit var inviteExpirationTime: String

    @Transactional
    @Scheduled(every = "15m")
    fun deleteUnconfirmedUsersAndOrganizations() {
        val expirationCutoffTime = OffsetDateTime.now().minusSeconds(inviteExpirationTime.toLong())

        userService.removeMdsIdFromUnconfirmedUsers(expirationCutoffTime)

        val unconfirmedMdsIds = organizationService.getUnconfirmedOrganizationMdsIds(expirationCutoffTime)
        unconfirmedMdsIds.forEach { mdsId ->
            keycloakService.deleteOrganization(mdsId)
            Log.info("Deleted unconfirmed organization in Keycloak. mdsId=$mdsId.")
        }
        val deletedOrgsAmount = organizationService.deleteUnconfirmedOrganizations(unconfirmedMdsIds)
        Log.info("Deleted unconfirmed organizations in DB. amount=$deletedOrgsAmount.")

        val unconfirmedUserIds = userService.getUnconfirmedUserIds(expirationCutoffTime)
        unconfirmedUserIds.forEach { userId ->
            keycloakService.deleteUser(userId)
            Log.info("Deleted unconfirmed user in Keycloak. userId=$userId.")
        }
        val deletedUsersAmount = userService.deleteUnconfirmedUsers(unconfirmedUserIds)
        Log.info("Deleted unconfirmed users in DB. amount=$deletedUsersAmount.")
    }
}
