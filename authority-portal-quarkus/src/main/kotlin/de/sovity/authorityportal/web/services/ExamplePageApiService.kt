package de.sovity.authorityportal.web.services

import de.sovity.authorityportal.api.model.ExamplePageQuery
import de.sovity.authorityportal.api.model.ExamplePageResult
import jakarta.enterprise.context.ApplicationScoped

@ApplicationScoped
class ExamplePageApiService {

    fun examplePage(query: ExamplePageQuery): ExamplePageResult {
        val result = ExamplePageResult()
        result.greetingResult = "${query.greeting} to you, too!"
        return result
    }

}