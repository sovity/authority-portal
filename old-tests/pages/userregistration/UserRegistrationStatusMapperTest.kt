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

package de.sovity.authorityportal.web.pages.userregistration

import de.sovity.authorityportal.api.model.UserRegistrationStatusDto
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

class UserRegistrationStatusMapperTest {

    @Test
    fun testUserRegistrationStatusMapper() {
        assertThat(UserRegistrationStatus.INVITED.toDto()).isEqualTo(UserRegistrationStatusDto.INVITED)
        assertThat(UserRegistrationStatus.ONBOARDING.toDto()).isEqualTo(UserRegistrationStatusDto.ONBOARDING)
        assertThat(UserRegistrationStatus.PENDING.toDto()).isEqualTo(UserRegistrationStatusDto.PENDING)
        assertThat(UserRegistrationStatus.ACTIVE.toDto()).isEqualTo(UserRegistrationStatusDto.ACTIVE)
        assertThat(UserRegistrationStatus.REJECTED.toDto()).isEqualTo(UserRegistrationStatusDto.REJECTED)
        assertThat(UserRegistrationStatus.DEACTIVATED.toDto()).isEqualTo(UserRegistrationStatusDto.DEACTIVATED)

        assertThat(UserRegistrationStatusDto.INVITED.toDb()).isEqualTo(UserRegistrationStatus.INVITED)
        assertThat(UserRegistrationStatusDto.ONBOARDING.toDb()).isEqualTo(UserRegistrationStatus.ONBOARDING)
        assertThat(UserRegistrationStatusDto.PENDING.toDb()).isEqualTo(UserRegistrationStatus.PENDING)
        assertThat(UserRegistrationStatusDto.ACTIVE.toDb()).isEqualTo(UserRegistrationStatus.ACTIVE)
        assertThat(UserRegistrationStatusDto.REJECTED.toDb()).isEqualTo(UserRegistrationStatus.REJECTED)
        assertThat(UserRegistrationStatusDto.DEACTIVATED.toDb()).isEqualTo(UserRegistrationStatus.DEACTIVATED)
    }
}
