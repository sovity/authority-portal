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

package de.sovity.authorityportal.broker;

import de.sovity.authorityportal.broker.api.api.BrokerServerResource;
import de.sovity.authorityportal.broker.api.api.model.AuthorityPortalConnectorDataOfferInfo;
import de.sovity.authorityportal.broker.api.api.model.AuthorityPortalConnectorInfo;
import de.sovity.authorityportal.broker.api.api.model.AuthorityPortalOrganizationMetadataRequest;
import de.sovity.authorityportal.broker.api.api.model.CatalogPageQuery;
import de.sovity.authorityportal.broker.api.api.model.CatalogPageResult;
import de.sovity.authorityportal.broker.api.api.model.ConnectorCreationRequest;
import de.sovity.authorityportal.broker.api.api.model.ConnectorDetailPageQuery;
import de.sovity.authorityportal.broker.api.api.model.ConnectorDetailPageResult;
import de.sovity.authorityportal.broker.api.api.model.ConnectorPageQuery;
import de.sovity.authorityportal.broker.api.api.model.ConnectorPageResult;
import de.sovity.authorityportal.broker.api.api.model.DataOfferDetailPageQuery;
import de.sovity.authorityportal.broker.api.api.model.DataOfferDetailPageResult;
import de.sovity.authorityportal.broker.services.api.AuthorityPortalConnectorDataOfferApiService;
import de.sovity.authorityportal.broker.services.api.AuthorityPortalConnectorMetadataApiService;
import de.sovity.authorityportal.broker.services.api.AuthorityPortalOrganizationMetadataApiService;
import de.sovity.authorityportal.broker.services.api.CatalogApiService;
import de.sovity.authorityportal.broker.services.api.ConnectorApiService;
import de.sovity.authorityportal.broker.services.api.ConnectorDetailApiService;
import de.sovity.authorityportal.broker.services.api.ConnectorListApiService;
import de.sovity.authorityportal.broker.services.api.DataOfferDetailApiService;
import de.sovity.authorityportal.broker.services.config.AdminApiKeyValidator;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import java.util.List;


/**
 * Implementation of {@link BrokerServerResource}
 */
@ApplicationScoped
public class BrokerServerResourceImpl implements BrokerServerResource {
    private final ConnectorApiService connectorApiService;
    private final ConnectorListApiService connectorListApiService;
    private final ConnectorDetailApiService connectorDetailApiService;
    private final CatalogApiService catalogApiService;
    private final DataOfferDetailApiService dataOfferDetailApiService;
    private final AdminApiKeyValidator adminApiKeyValidator;
    private final AuthorityPortalConnectorMetadataApiService authorityPortalConnectorMetadataApiService;
    private final AuthorityPortalConnectorDataOfferApiService authorityPortalConnectorDataOffersApiService;
    private final AuthorityPortalOrganizationMetadataApiService authorityPortalOrganizationMetadataApiService;

    @Override
    @Transactional
    public CatalogPageResult catalogPage(CatalogPageQuery query) {
        return catalogApiService.catalogPage(dsl, query);
    }

    @Override
    @Transactional
    public ConnectorPageResult connectorPage(ConnectorPageQuery query) {
        return connectorListApiService.connectorListPage(dsl, query);
    }

    @Override
    @Transactional
    public DataOfferDetailPageResult dataOfferDetailPage(DataOfferDetailPageQuery query) {
        return dataOfferDetailApiService.dataOfferDetailPage(dsl, query);
    }

    @Override
    @Transactional
    public ConnectorDetailPageResult connectorDetailPage(ConnectorDetailPageQuery query) {
        return connectorDetailApiService.connectorDetailPage(dsl, query);
    }

    @Override
    @Transactional
    public void addConnectors(List<String> endpoints, String adminApiKey) {
        adminApiKeyValidator.validateAdminApiKey(adminApiKey);
        connectorApiService.addConnectors(dsl, endpoints);
    }

    @Override
    @Transactional
    public void addConnectorsWithMdsIds(ConnectorCreationRequest connectors, String adminApiKey) {
        adminApiKeyValidator.validateAdminApiKey(adminApiKey);
        connectorApiService.addConnectorsWithMdsIds(dsl, connectors);
    }

    @Override
    @Transactional
    public void deleteConnectors(List<String> endpoints, String adminApiKey) {
        adminApiKeyValidator.validateAdminApiKey(adminApiKey);
        dslContextFactory.transaction(dsl -> connectorApiService.deleteConnectors(dsl, endpoints));
    }

    @Override
    @Transactional
    public List<AuthorityPortalConnectorInfo> getConnectorMetadata(List<String> endpoints, String adminApiKey) {
        adminApiKeyValidator.validateAdminApiKey(adminApiKey);
        return authorityPortalConnectorMetadataApiService.getMetadataByEndpoints(dsl, endpoints);
    }

    @Override
    @Transactional
    public void setOrganizationMetadata(AuthorityPortalOrganizationMetadataRequest organizationMetadataRequest, String adminApiKey) {
        adminApiKeyValidator.validateAdminApiKey(adminApiKey);
        authorityPortalOrganizationMetadataApiService.setOrganizationMetadata(dsl, organizationMetadataRequest.getOrganizations());
    }

    @Override
    @Transactional
    public List<AuthorityPortalConnectorDataOfferInfo> getConnectorDataOffers(List<String> endpoints, String adminApiKey) {
        adminApiKeyValidator.validateAdminApiKey(adminApiKey);
        return authorityPortalConnectorDataOffersApiService.getConnectorDataOffersByEndpoints(dsl, endpoints);
    }
}
