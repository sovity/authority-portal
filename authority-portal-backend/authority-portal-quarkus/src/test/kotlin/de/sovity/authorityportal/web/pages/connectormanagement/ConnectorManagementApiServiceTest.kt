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
package de.sovity.authorityportal.web.pages.connectormanagement

import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

@QuarkusTest
class ConnectorManagementApiServiceTest {

    @Inject
    lateinit var connectorManagementApiService: ConnectorManagementApiService


    @Test
    fun testGetAllDeploymentEnvironment() {
        // act
        val result = connectorManagementApiService.getAllDeploymentEnvironment()

        // assert
        assertEquals(1, result.size)
        assertEquals("test", result.get(0).environmentId)
        assertEquals("Test Environment", result.get(0).title)
    }
}
