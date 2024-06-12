package de.sovity.authorityportal.seeds

import de.sovity.authorityportal.seeds.utils.ScenarioData
import de.sovity.authorityportal.seeds.utils.ScenarioInstaller
import jakarta.enterprise.context.ApplicationScoped
import jakarta.transaction.Transactional

@ApplicationScoped
class EmptyScenario(
    val scenarioInstaller: ScenarioInstaller
) : SeedScenario {

    override val name = "empty"

    @Transactional
    override fun install() {
        val scenario = init()
        scenarioInstaller.install(scenario)
    }

    override fun init(): ScenarioData {
        val scenario = ScenarioData()
        // scenario.user ... maybe create an authority admin user here to test apis

        return scenario
    }
}
