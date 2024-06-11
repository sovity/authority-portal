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
package de.sovity.authorityportal.broker.dao.pages.dataoffer.model

import de.sovity.authorityportal.db.jooq.enums.ConnectorOnlineStatus
import java.time.OffsetDateTime

class DataOfferDetailRs(
    val assetId: String,
    val assetUiJson: String,
    val createdAt: OffsetDateTime,
    val updatedAt: OffsetDateTime,
    val contractOffers: List<ContractOfferRs>,
    val connectorEndpoint: String,
    val connectorOnlineStatus: ConnectorOnlineStatus,
    val connectorParticipantId: String,
    val organizationName: String,
    val connectorOfflineSinceOrLastUpdatedAt: OffsetDateTime,
    val viewCount: Int,
)