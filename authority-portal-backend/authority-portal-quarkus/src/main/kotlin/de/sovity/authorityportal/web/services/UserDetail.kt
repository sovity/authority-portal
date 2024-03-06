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
package de.sovity.authorityportal.web.services

import de.sovity.authorityportal.db.jooq.enums.UserOnboardingType
import de.sovity.authorityportal.db.jooq.enums.UserRegistrationStatus
import java.time.OffsetDateTime

data class UserDetail(
    val userId: String,
    val firstName: String,
    val lastName: String,
    val email: String,
    val position: String?,
    val phoneNumber: String?,
    val organizationMdsId: String?,
    val registrationStatus: UserRegistrationStatus,
    val createdAt: OffsetDateTime,
    val roles: Set<String>,
    val onboardingType: UserOnboardingType,
    val invitedBy: String?
)
