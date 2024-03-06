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

package de.sovity.authorityportal.web.model

import de.sovity.authorityportal.db.jooq.enums.OrganizationLegalIdType

class CreateOrganizationData {
    var name: String? = null
    var url: String? = null
    var businessUnit: String? = null
    var industry: String? = null
    var address: String? = null
    var billingAddress: String? = null
    var description: String? = null
    var legalIdType: OrganizationLegalIdType? = null
    var legalIdNumber: String? = null
    var commerceRegisterLocation: String? = null
    var mainContactName: String? = null
    var mainContactEmail: String? = null
    var mainContactPhone: String? = null
    var techContactName: String? = null
    var techContactEmail: String? = null
    var techContactPhone: String? = null
}
