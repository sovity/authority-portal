/*
 *  Copyright (c) 2023 sovity GmbH
 *
 *  This program and the accompanying materials are made available under the
 *  terms of the Apache License, Version 2.0 which is available at
 *  https://www.apache.org/licenses/LICENSE-2.0
 *
 *  SPDX-License-Identifier: Apache-2.0
 *
 *  Contributors:
 *       sovity GmbH - initial API and implementation
 *
 */
package de.sovity.authorityportal.broker.dao.pages.catalog.models

import de.sovity.authorityportal.db.jooq.enums.ConnectorOnlineStatus
import java.time.OffsetDateTime

data class DataOfferListEntryRs(
    val assetId: String,
    val assetTitle: String,
    val shortDescriptionMoMarkdown: String,
    val version: String,
    val keywords: List<String>,
    val connectorId: String,
    val organizationId: String,
    val organizationName: String,
    val connectorOnlineStatus: ConnectorOnlineStatus,
    val connectorOfflineSinceOrLastUpdatedAt: OffsetDateTime,
    val connectorEndpointUrl: String
)
