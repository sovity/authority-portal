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

package de.sovity.edc.ext.catalog.crawler;

import de.sovity.edc.ext.wrapper.api.common.mappers.PlaceholderEndpointService;
import org.eclipse.edc.connector.api.management.configuration.transform.ManagementApiTypeTransformerRegistry;
import org.eclipse.edc.connector.spi.catalog.CatalogService;
import org.eclipse.edc.jsonld.spi.JsonLd;
import org.eclipse.edc.runtime.metamodel.annotation.Inject;
import org.eclipse.edc.runtime.metamodel.annotation.Provides;
import org.eclipse.edc.runtime.metamodel.annotation.Setting;
import org.eclipse.edc.spi.system.ServiceExtension;
import org.eclipse.edc.spi.system.ServiceExtensionContext;
import org.eclipse.edc.spi.types.TypeManager;

import static de.sovity.edc.ext.catalog.crawler.orchestration.config.EdcConfigPropertyUtils.toEdcProp;

@Provides({CrawlerExtensionContext.class})
public class CrawlerExtension implements ServiceExtension {

    public static final String EXTENSION_NAME = "Authority Portal Data Catalog Crawler";

    @Inject
    private TypeManager typeManager;

    @Inject
    private ManagementApiTypeTransformerRegistry typeTransformerRegistry;

    @Inject
    private JsonLd jsonLd;

    @Inject
    private CatalogService catalogService;

    /**
     * Manual Dependency Injection Result
     */
    private CrawlerExtensionContext services;

    @Override
    public String name() {
        return EXTENSION_NAME;
    }

    @Override
    public void initialize(ServiceExtensionContext context) {
        services = CrawlerExtensionContextBuilder.buildContext(
            context.getConfig(),
            context.getMonitor(),
            typeManager,
            typeTransformerRegistry,
            jsonLd,
            catalogService,
            new PlaceholderEndpointService("http://0.0.0.0/")
        );

        // Provide access for the tests
        context.registerService(CrawlerExtensionContext.class, services);
    }

    @Override
    public void start() {
        if (services == null) {
            return;
        }
        services.crawlerInitializer().onStartup();
    }

    @Override
    public void shutdown() {
        if (services == null) {
            return;
        }
        services.dataSource().close();
    }
}
