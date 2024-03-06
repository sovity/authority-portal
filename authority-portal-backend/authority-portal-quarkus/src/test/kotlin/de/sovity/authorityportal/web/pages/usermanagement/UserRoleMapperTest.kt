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

package de.sovity.authorityportal.web.pages.usermanagement

import de.sovity.authorityportal.api.model.UserRoleDto
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

class UserRoleMapperTest {

    @Test
    fun testGetHighestRolesAll() {
        assertThat(UserRoleMapper().getHighestRoles(setOf(
            UserRoleDto.OPERATOR_ADMIN,
            UserRoleDto.SERVICE_PARTNER_ADMIN,
            UserRoleDto.AUTHORITY_ADMIN,
            UserRoleDto.AUTHORITY_USER,
            UserRoleDto.ADMIN,
            UserRoleDto.KEY_USER,
            UserRoleDto.USER
        ))).isEqualTo(listOf(
            UserRoleDto.AUTHORITY_ADMIN,
            UserRoleDto.OPERATOR_ADMIN,
            UserRoleDto.SERVICE_PARTNER_ADMIN,
            UserRoleDto.ADMIN
        ))
    }

    @Test
    fun testGetHighestRolesEmpty() {
        assertThat(UserRoleMapper().getHighestRoles(setOf())).isEmpty()
    }
}
