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
package de.sovity.authorityportal.web.thirdparty.keycloak

import jakarta.ws.rs.WebApplicationException
import jakarta.ws.rs.core.Response
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.keycloak.admin.client.Keycloak
import org.keycloak.admin.client.resource.RealmResource
import org.keycloak.admin.client.resource.RoleMappingResource
import org.keycloak.admin.client.resource.RoleScopeResource
import org.keycloak.admin.client.resource.UserResource
import org.keycloak.admin.client.resource.UsersResource
import org.keycloak.representations.idm.RoleRepresentation
import org.keycloak.representations.idm.UserRepresentation
import org.mockito.ArgumentMatchers.eq
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.mockito.Mockito.`when`
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.anyVararg
import org.mockito.kotlin.verify


@ExtendWith(MockitoExtension::class)
class KeycloakServiceTest {
    @InjectMocks
    lateinit var keycloakService: KeycloakService

    @Mock
    lateinit var keycloak: Keycloak

    @Mock
    lateinit var realmResource: RealmResource

    @Mock
    lateinit var usersResource: UsersResource

    @BeforeEach
    fun setUp() {
        `when`(keycloak.realm(eq("authority-portal"))).thenReturn(realmResource)
        `when`(realmResource.users()).thenReturn(usersResource)
        keycloakService.keycloakRealm = "authority-portal"
    }

    @Test
    fun testGetUserRoles() {
        // arrange
        val userId = "123"
        val userResource = mock(UserResource::class.java)
        val roleMappingResource = mock(RoleMappingResource::class.java)
        val roleScopeResource = mock(RoleScopeResource::class.java)
        val role1 = mock(RoleRepresentation::class.java)
        val role2 = mock(RoleRepresentation::class.java)
        `when`(role1.name).thenReturn("UR_AUTHORITY-PORTAL_AUTHORITY-USER")
        `when`(role2.name).thenReturn("UR_AUTHORITY-PORTAL_PARTICIPANT-CURATOR")

        `when`(usersResource.get(eq(userId))).thenReturn(userResource)
        `when`(userResource.roles()).thenReturn(roleMappingResource)
        `when`(roleMappingResource.realmLevel()).thenReturn(roleScopeResource)
        `when`(roleScopeResource.listEffective()).thenReturn(listOf(role1, role2))

        // act
        val userRoles = keycloakService.getUserRoles(userId)

        // assert
        assert(userRoles.contains("UR_AUTHORITY-PORTAL_AUTHORITY-USER"))
        assert(userRoles.contains("UR_AUTHORITY-PORTAL_PARTICIPANT-CURATOR"))
    }

    @Test
    fun testExceptionForCreatingExistingUser() {
        // arrange
        `when`(usersResource.create(anyVararg(UserRepresentation::class))).thenReturn(Response.status(Response.Status.CONFLICT).build())

        // assert
        Assertions.assertThatThrownBy { keycloakService.createUser("testEmail", "testName", "testLastName") }
            .isInstanceOf(WebApplicationException::class.java)
            .hasMessage("User already exists")

        // verify
        verify(usersResource).create(anyVararg(UserRepresentation::class))
    }

    private fun mockUserResource(representation: UserRepresentation): UserResource {
        val userResource = mock(UserResource::class.java)
        `when`(usersResource.get(eq(representation.id))).thenReturn(userResource)
        `when`(userResource.toRepresentation()).thenReturn(representation)

        return userResource
    }
}


