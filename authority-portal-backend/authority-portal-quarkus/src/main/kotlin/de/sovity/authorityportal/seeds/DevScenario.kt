package de.sovity.authorityportal.seeds

import de.sovity.authorityportal.db.jooq.enums.OrganizationRegistrationStatus
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import de.sovity.authorityportal.seeds.utils.ScenarioData
import de.sovity.authorityportal.seeds.utils.ScenarioInstaller
import jakarta.enterprise.context.ApplicationScoped
import jakarta.transaction.Transactional

@ApplicationScoped
class DevScenario(
    val scenarioInstaller: ScenarioInstaller
) : SeedScenario {

    override val name = "dev"

    @Transactional
    override fun install() {
        val scenario = init()
        scenarioInstaller.install(scenario)
    }

    override fun init(): ScenarioData {
        val scenario = ScenarioData().apply {
            // Authority
            user(1, 1) {
                it.firstName = "Authority"
                it.lastName = "Admin"
            }
            organization(1, 1) {
                it.name = "Authority Organization"
            }
            user(2, 1) {
                it.firstName = "Authority"
                it.lastName = "User"
            }

            // Participant
            user(3, 2) {
                it.firstName = "Participant"
                it.lastName = "Admin"
            }
            organization(2, 3) {
                it.name = "Participant Organization"
            }
            user(4, 2) {
                it.firstName = "Participant"
                it.lastName = "User"
            }

            // Pending
            user(5, 3) {
                it.firstName = "Pending"
                it.lastName = "User"
                it.registrationStatus = UserRegistrationStatus.PENDING
            }
            organization(3, 5) {
                it.name = "Pending Organization"
                it.registrationStatus = OrganizationRegistrationStatus.PENDING
            }

            // User without organization
            user(6, null) {
                it.firstName = "Broken"
                it.lastName = "User"
                it.organizationMdsId = null
            }

            // Service Partner Admin
            user(7, 4) {
                it.firstName = "Service Partner"
                it.lastName = "Admin"
            }
            organization(4, 7) {
                it.name = "Service Partner Organization"
            }
        }
        return scenario
    }
}
