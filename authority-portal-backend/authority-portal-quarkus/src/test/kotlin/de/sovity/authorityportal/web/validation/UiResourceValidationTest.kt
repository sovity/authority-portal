/*
 * Copyright (c) 2024 sovity GmbH
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Contributors:
 *      sovity GmbH - initial implementation
 */
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
                "userEmail": "email@email.tt",
                "userFirstName": "",
                "userLastName": "lastName",
                "orgName": "orgName",
                "userJobTitle": "userJobTitle",
                "userPhoneNumber": "userPhoneNumber"
            }
        """.trimIndent()

        given()
            .contentType(ContentType.JSON)
            .body(invalidRequest)
            .`when`()
            .post("api/authority/organizations/invite")
            .then()
            .statusCode(400)
            .body("violations[0].message", `is`("User first name cannot be blank"))
    }

    @Test
    fun testNotNull() {
        given()
            .contentType(ContentType.JSON)
            .`when`()
            .post("api/authority/organizations/invite")
            .then()
            .statusCode(400)
            .body("violations[0].message", `is`("Invitation information cannot be null"))
    }
}
