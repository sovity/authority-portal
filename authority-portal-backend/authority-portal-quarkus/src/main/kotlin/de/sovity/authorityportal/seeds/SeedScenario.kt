package de.sovity.authorityportal.seeds

import de.sovity.authorityportal.seeds.utils.ScenarioData
import jakarta.transaction.Transactional

interface SeedScenario {
    val name: String

    @Transactional
    fun install()
    fun init(): ScenarioData
}
