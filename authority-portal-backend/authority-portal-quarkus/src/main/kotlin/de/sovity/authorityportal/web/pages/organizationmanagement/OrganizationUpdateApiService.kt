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

import de.sovity.authorityportal.api.model.IdResponse
import de.sovity.authorityportal.api.model.UpdateOrganizationDto
import de.sovity.authorityportal.api.model.organization.OnboardingOrganizationUpdateDto
import de.sovity.authorityportal.web.services.OrganizationService
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject

@ApplicationScoped
class OrganizationUpdateApiService {

    @Inject
    lateinit var organizationService: OrganizationService

    fun updateOrganization(mdsId: String, dto: UpdateOrganizationDto): IdResponse {
        organizationService.updateOrganization(mdsId, dto)
        return IdResponse(mdsId)
    }

    fun onboardOrganization(mdsId: String, dto: OnboardingOrganizationUpdateDto): IdResponse {
        organizationService.onboardOrganization(mdsId, dto)
        return IdResponse(mdsId)
    }


}
