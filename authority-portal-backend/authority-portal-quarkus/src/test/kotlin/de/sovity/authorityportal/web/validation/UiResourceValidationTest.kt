package de.sovity.authorityportal.web.validation

import io.quarkus.test.junit.QuarkusTest
import io.restassured.RestAssured.given
import io.restassured.http.ContentType
import org.hamcrest.CoreMatchers.`is`
import org.junit.jupiter.api.Test

@QuarkusTest
class UiResourceValidationTest {

    @Test
    fun testNotBlank() {
        val invalidRequest = """
            {
                "name": "",
                "address": "Example Address",
                "taxId": "123456789",
                "url": "https://example.com",
                "securityEmail": "security@example.com"
            }
        """.trimIndent()

        given()
            .contentType(ContentType.JSON)
            .body(invalidRequest)
            .`when`()
            .post("/api/registration/organization")
            .then()
            .statusCode(400)
            .body("violations[0].message", `is`("Name cannot be blank"))
    }

    @Test
    fun testNotNull() {
        given()
            .contentType(ContentType.JSON)
            .`when`()
            .post("/api/registration/organization")
            .then()
            .statusCode(400)
            .body("violations[0].message", `is`("Organization cannot be null"))
    }
}
