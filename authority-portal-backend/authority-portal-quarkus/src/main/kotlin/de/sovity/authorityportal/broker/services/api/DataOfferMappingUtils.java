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

import de.sovity.edc.ext.wrapper.api.common.model.UiAsset;
import de.sovity.edc.ext.wrapper.api.common.model.UiPolicy;
import de.sovity.edc.ext.wrapper.api.common.mappers.AssetMapper;
import de.sovity.edc.ext.wrapper.api.common.mappers.PolicyMapper;
import de.sovity.edc.utils.JsonUtils;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import lombok.RequiredArgsConstructor;

@ApplicationScoped
public class DataOfferMappingUtils {
    @Inject
    PolicyMapper policyMapper;
    @Inject
    AssetMapper assetMapper;

    public UiAsset buildUiAsset(String assetJsonLd, String endpoint, String participantId, String organizationName) {
        var asset = assetMapper.buildAsset(JsonUtils.parseJsonObj(assetJsonLd));
        var uiAsset = assetMapper.buildUiAsset(asset, endpoint, participantId);
        uiAsset.setCreatorOrganizationName(organizationName);
        return uiAsset;
    }

    public UiPolicy buildUiPolicy(String policyJson) {
        var policy = policyMapper.buildPolicy(policyJson);
        return policyMapper.buildUiPolicy(policy);
    }
}
