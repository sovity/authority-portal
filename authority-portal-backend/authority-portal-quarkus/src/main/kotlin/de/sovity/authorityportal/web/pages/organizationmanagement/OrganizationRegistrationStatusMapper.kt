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
package de.sovity.authorityportal.web.pages.organizationmanagement

import de.sovity.authorityportal.api.model.organization.OrganizationRegistrationStatusDto
import de.sovity.authorityportal.db.jooq.enums.OrganizationRegistrationStatus

fun OrganizationRegistrationStatus.toDto(): OrganizationRegistrationStatusDto = when (this) {
    OrganizationRegistrationStatus.INVITED -> OrganizationRegistrationStatusDto.INVITED
    OrganizationRegistrationStatus.ONBOARDING -> OrganizationRegistrationStatusDto.ONBOARDING
    OrganizationRegistrationStatus.PENDING -> OrganizationRegistrationStatusDto.PENDING
    OrganizationRegistrationStatus.ACTIVE -> OrganizationRegistrationStatusDto.ACTIVE
    OrganizationRegistrationStatus.REJECTED -> OrganizationRegistrationStatusDto.REJECTED
}

fun OrganizationRegistrationStatusDto.toDb(): OrganizationRegistrationStatus = when (this) {
    OrganizationRegistrationStatusDto.INVITED -> OrganizationRegistrationStatus.INVITED
    OrganizationRegistrationStatusDto.ONBOARDING -> OrganizationRegistrationStatus.ONBOARDING
    OrganizationRegistrationStatusDto.PENDING -> OrganizationRegistrationStatus.PENDING
    OrganizationRegistrationStatusDto.ACTIVE -> OrganizationRegistrationStatus.ACTIVE
    OrganizationRegistrationStatusDto.REJECTED -> OrganizationRegistrationStatus.REJECTED
    else -> OrganizationRegistrationStatus.REJECTED
}
