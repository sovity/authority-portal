package de.sovity.authorityportal.web

import de.sovity.authorityportal.web.services.ExampleTableApiService
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito.`when`
import org.mockito.junit.jupiter.MockitoExtension


@ExtendWith(MockitoExtension::class)
class GetExampleTableIdsUnitTest {
    @InjectMocks
    lateinit var uiResourceImpl: UiResourceImpl

    @Mock
    lateinit var exampleTableApiService: ExampleTableApiService

    @Test
    fun exampleUnitTest() {
        // arrange
        val expected = listOf("1", "2", "3")
        `when`(exampleTableApiService.getExampleTableIds()).thenReturn(expected)

        // act
        val actual = uiResourceImpl.exampleDbQuery()

        // assert
        assertThat(actual).isEqualTo(expected)
    }
}