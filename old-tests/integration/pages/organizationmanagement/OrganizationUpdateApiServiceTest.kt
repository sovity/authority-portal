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

package de.sovity.authorityportal.web.integration.pages.organizationmanagement

import de.sovity.authorityportal.api.model.UpdateOrganizationDto
import de.sovity.authorityportal.web.integration.pages.TestData
import de.sovity.authorityportal.web.pages.organizationmanagement.OrganizationUpdateApiService
import de.sovity.authorityportal.web.services.OrganizationService
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.junit.jupiter.MockitoExtension

@QuarkusTest
@ExtendWith(MockitoExtension::class)
class OrganizationUpdateApiServiceTest {

    @Inject
    lateinit var organizationUpdateApiService: OrganizationUpdateApiService

    @Inject
    lateinit var organizationService: OrganizationService

    val mdsId = "MDSL2222CC"

    @Test
    fun testUpdateOrganizationDetails() {
        // arrange
        val organizationDto = UpdateOrganizationDto(
            url = TestData.ORG_URL,
            businessUnit = TestData.ORG_BUSINESS_UNIT,
            address = TestData.ORG_ADDRESS,
            industry = TestData.ORG_INDUSTRY,
            description = TestData.ORG_DESCRIPTION,
            billingAddress = TestData.ORG_BILLING_ADDRESS,
            mainContactName = TestData.ORG_MAIN_CONTACT_NAME,
            mainContactEmail = TestData.ORG_MAIN_CONTACT_EMAIL,
            mainContactPhone = TestData.ORG_MAIN_CONTACT_PHONE,
            techContactName = TestData.ORG_TECH_CONTACT_NAME,
            techContactEmail = TestData.ORG_TECH_CONTACT_EMAIL,
            techContactPhone = TestData.ORG_TECH_CONTACT_PHONE
        )

        // act
        val result = organizationUpdateApiService.updateOrganization(mdsId, organizationDto)
        val organization = organizationService.getOrganizationOrThrow(mdsId)

        // assert
        assertThat(result.id).isEqualTo(mdsId)
        assertThat(organization.url).isEqualTo(TestData.ORG_URL)
        assertThat(organization.businessUnit).isEqualTo(TestData.ORG_BUSINESS_UNIT)
        assertThat(organization.industry).isEqualTo(TestData.ORG_INDUSTRY)
        assertThat(organization.address).isEqualTo(TestData.ORG_ADDRESS)
        assertThat(organization.billingAddress).isEqualTo(TestData.ORG_BILLING_ADDRESS)
        assertThat(organization.mainContactName).isEqualTo(TestData.ORG_MAIN_CONTACT_NAME)
        assertThat(organization.mainContactEmail).isEqualTo(TestData.ORG_MAIN_CONTACT_EMAIL)
        assertThat(organization.mainContactPhone).isEqualTo(TestData.ORG_MAIN_CONTACT_PHONE)
        assertThat(organization.techContactName).isEqualTo(TestData.ORG_TECH_CONTACT_NAME)
        assertThat(organization.techContactEmail).isEqualTo(TestData.ORG_TECH_CONTACT_EMAIL)
        assertThat(organization.techContactPhone).isEqualTo(TestData.ORG_TECH_CONTACT_PHONE)
    }
}
