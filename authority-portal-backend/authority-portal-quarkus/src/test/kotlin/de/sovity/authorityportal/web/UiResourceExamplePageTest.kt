package de.sovity.authorityportal.web

import de.sovity.authorityportal.client.gen.model.ExamplePageQuery
import io.quarkus.test.common.http.TestHTTPResource
import io.quarkus.test.junit.QuarkusTest
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import java.net.URL

@QuarkusTest
class UiResourceExamplePageTest {
    @TestHTTPResource
    lateinit var backendUrl: URL

    @Test
    fun testExampleEndpoint() {
        // arrange
        val client = buildApiClient(backendUrl)
        val query = ExamplePageQuery().greeting("Hello")

        // act
        val actual = client.uiApi().examplePage(query)

        // assert
        assertThat(actual.greetingResult).isEqualTo("Hello to you, too!")
    }
}