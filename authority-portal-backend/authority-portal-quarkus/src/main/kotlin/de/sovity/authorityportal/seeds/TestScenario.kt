package de.sovity.authorityportal.seeds

import de.sovity.authorityportal.seeds.utils.ScenarioData
import de.sovity.authorityportal.seeds.utils.ScenarioInstaller
import jakarta.enterprise.context.ApplicationScoped
import jakarta.transaction.Transactional

@ApplicationScoped
class TestScenario(
    val scenarioInstaller: ScenarioInstaller
) : SeedScenario {

    override val name = "test"

    @Transactional
    override fun install() {
        val scenario = init()
        scenarioInstaller.install(scenario)
    }

    override fun init(): ScenarioData {
        return ScenarioData().apply {

        }
    }
}
