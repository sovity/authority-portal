package de.sovity.authorityportal.web

import de.sovity.authorityportal.api.UiResource
import de.sovity.authorityportal.api.model.ExamplePageQuery
import de.sovity.authorityportal.api.model.ExamplePageResult
import de.sovity.authorityportal.web.services.ExamplePageApiService
import de.sovity.authorityportal.web.services.ExampleTableApiService
import jakarta.transaction.Transactional

class UiResourceImpl : UiResource {
    lateinit var examplePageApiService: ExamplePageApiService
    lateinit var exampleTableApiService: ExampleTableApiService

    @Transactional
    override fun examplePage(query: ExamplePageQuery): ExamplePageResult {
        return examplePageApiService.examplePage(query)
    }

    @Transactional
    override fun exampleDbQuery(): MutableList<String> {
        return exampleTableApiService.getExampleTableIds().toMutableList();
    }

//    Endpunkt mit DB connection: Immer @Transactional
}
