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

package de.sovity.authorityportal.broker.dao.pages.catalog.models;

import de.sovity.authorityportal.broker.dao.pages.dataoffer.model.ContractOfferRs;
import de.sovity.authorityportal.db.jooq.enums.ConnectorOnlineStatus;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.time.OffsetDateTime;
import java.util.List;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DataOfferListEntryRs {
    String assetId;
    OffsetDateTime createdAt;
    OffsetDateTime updatedAt;
    List<ContractOfferRs> contractOffers;
    String connectorId;
    ConnectorOnlineStatus connectorOnlineStatus;
    String connectorParticipantId;
    String organizationName;
    OffsetDateTime connectorOfflineSinceOrLastUpdatedAt;
}
