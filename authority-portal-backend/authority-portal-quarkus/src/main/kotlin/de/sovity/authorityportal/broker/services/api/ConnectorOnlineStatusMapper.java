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

package de.sovity.authorityportal.broker.services.api;

import de.sovity.authorityportal.broker.api.model.ConnectorOnlineStatusDto;
import de.sovity.authorityportal.db.jooq.enums.ConnectorOnlineStatus;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ConnectorOnlineStatusMapper {

    public ConnectorOnlineStatusDto getOnlineStatus(ConnectorOnlineStatus onlineStatus) {
        return switch (onlineStatus) {
            case ONLINE -> ConnectorOnlineStatusDto.ONLINE;
            case OFFLINE -> ConnectorOnlineStatusDto.OFFLINE;
            case DEAD -> ConnectorOnlineStatusDto.DEAD;
            default -> throw new IllegalStateException("Unknown ConnectorOnlineStatus from DAO for API: " + onlineStatus);
        };
    }
}
