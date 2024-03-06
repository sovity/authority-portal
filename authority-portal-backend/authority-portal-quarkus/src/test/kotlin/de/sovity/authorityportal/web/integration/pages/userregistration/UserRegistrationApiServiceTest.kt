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
package de.sovity.authorityportal.web.integration.pages.userregistration

import de.sovity.authorityportal.api.model.UserRegistrationStatusDto
import de.sovity.authorityportal.web.pages.userregistration.UserRegistrationApiService
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.junit.jupiter.MockitoExtension

@QuarkusTest
@ExtendWith(MockitoExtension::class)
class UserRegistrationApiServiceTest {

    @Inject
    lateinit var userRegistrationApiService: UserRegistrationApiService

    val userId = "00000000-0000-0000-0000-000000000001";

    @Test
    fun testUserRegistrationStatus() {
        // act
        val result = userRegistrationApiService.userRegistrationStatus(userId)

        // assert
        assertThat(result).isNotNull()
        assertThat(result.registrationStatus).isEqualTo(UserRegistrationStatusDto.ACTIVE)
    }

}
