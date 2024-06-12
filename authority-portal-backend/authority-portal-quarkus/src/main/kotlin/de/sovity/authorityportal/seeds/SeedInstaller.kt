package de.sovity.authorityportal.seeds

import io.quarkus.runtime.Startup
import jakarta.enterprise.context.ApplicationScoped
import jakarta.enterprise.inject.Instance
import jakarta.transaction.Transactional
import org.eclipse.microprofile.config.inject.ConfigProperty
import java.util.Optional

@ApplicationScoped
class SeedInstaller(
    val scenarios: Instance<SeedScenario>,
    @ConfigProperty(name = "de.sovity.authorityportal.seed.scenario") val scenarioId: Optional<String>
) {

    @Startup
    @Transactional
    fun seed() {
        if (scenarioId.isEmpty || scenarioId.get() == "none") {
            return
        }

        val scenario = scenarios.find { it.name == scenarioId.get() }
        scenario?.install() ?: error("Unknown seed scenario: ${scenarioId.get()}")
    }
}
