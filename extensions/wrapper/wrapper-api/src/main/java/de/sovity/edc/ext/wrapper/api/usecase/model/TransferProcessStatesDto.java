/*
 *  Copyright (c) 2022 sovity GmbH
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

package de.sovity.edc.ext.wrapper.api.usecase.model;

import de.sovity.edc.ext.wrapper.api.ui.model.TransferProcessSimplifiedState;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;

@Data
@AllArgsConstructor
public class TransferProcessStatesDto {
    @Schema(description = "States and count of incoming transferprocess counts", requiredMode = Schema.RequiredMode.REQUIRED)
    private Map<TransferProcessSimplifiedState, Long> incomingTransferProcessCounts;

    @Schema(description = "States and counts of outgoing transferprocess counts", requiredMode = Schema.RequiredMode.REQUIRED)
    private Map<TransferProcessSimplifiedState, Long> outgoingTransferProcessCounts;
}
