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

package de.sovity.authorityportal.web.thirdparty.broker.model

import io.swagger.v3.oas.annotations.media.Schema
import java.time.OffsetDateTime

@Schema(description = "Information about the data offers of a connector")
class AuthorityPortalDataOfferInfo {
    @Schema(description = "The endpoint url of the connector")
    val connectorEndpoint: String = ""
    @Schema(description = "The id of the connector")
    val participantId: String = ""
    @Schema(description = "The status of the connector")
    val onlineStatus: ConnectorOnlineStatus = ConnectorOnlineStatus.DEAD
    @Schema(description = "The time when the connector was last updated")
    val offlineSinceOrLastUpdatedAt: OffsetDateTime = OffsetDateTime.MIN
    @Schema(description = "The data offers of the connector")
    val dataOffers: List<DataOffer> = emptyList()
}
