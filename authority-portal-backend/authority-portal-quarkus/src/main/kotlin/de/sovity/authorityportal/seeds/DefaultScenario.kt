package de.sovity.authorityportal.seeds

import de.sovity.authorityportal.seeds.utils.ScenarioData
import de.sovity.authorityportal.seeds.utils.ScenarioInstaller
import jakarta.enterprise.context.ApplicationScoped
import jakarta.transaction.Transactional

@ApplicationScoped
class DefaultScenario(
    val scenarioInstaller: ScenarioInstaller
) : SeedScenario {

    override val name = "default"

    @Transactional
    override fun install() {
        val scenario = init()
        scenarioInstaller.install(scenario)
    }

    override fun init(): ScenarioData {
        val scenario = ScenarioData()
        // create scenario data here
        return scenario
    }
}
