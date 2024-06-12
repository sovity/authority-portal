package de.sovity.authorityportal.seeds.utils

import jakarta.enterprise.context.ApplicationScoped
import org.jooq.DSLContext

@ApplicationScoped
class ScenarioInstaller(
    val dsl: DSLContext
) {

    fun install(scenario: ScenarioData) {
        scenario.install(dsl)
    }

}
