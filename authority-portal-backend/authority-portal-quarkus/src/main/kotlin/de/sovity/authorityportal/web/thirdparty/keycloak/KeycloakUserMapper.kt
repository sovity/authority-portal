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

import de.sovity.authorityportal.web.thirdparty.keycloak.model.KeycloakUserDto
import jakarta.enterprise.context.ApplicationScoped
import org.keycloak.representations.idm.UserRepresentation

@ApplicationScoped
class KeycloakUserMapper {

    fun buildKeycloakUserDto(user: UserRepresentation) = KeycloakUserDto(
        userId = user.id,
        firstName = user.firstName,
        lastName = user.lastName,
        email = user.email
    )
}


