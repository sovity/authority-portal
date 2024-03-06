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

import de.sovity.authorityportal.api.model.UserOnboardingTypeDto
import de.sovity.authorityportal.db.jooq.enums.UserOnboardingType

fun UserOnboardingType.toDto(): UserOnboardingTypeDto = when (this) {
    UserOnboardingType.INVITATION -> UserOnboardingTypeDto.INVITATION
    UserOnboardingType.SELF_REGISTRATION -> UserOnboardingTypeDto.SELF_REGISTRATION
}

fun UserOnboardingTypeDto.toDb(): UserOnboardingType = when (this) {
    UserOnboardingTypeDto.INVITATION -> UserOnboardingType.INVITATION
    UserOnboardingTypeDto.SELF_REGISTRATION -> UserOnboardingType.SELF_REGISTRATION
}
