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

package de.sovity.edc.ext.catalog.crawler.orchestration.config;

import de.sovity.edc.ext.catalog.crawler.CrawlerConfigProps;
import de.sovity.edc.ext.catalog.crawler.CrawlerExtension;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.eclipse.edc.spi.system.configuration.Config;

import java.time.Duration;

@RequiredArgsConstructor
public class CrawlerConfigFactory {
    private final Config config;

    public CrawlerConfig buildCrawlerConfig() {
        var environmentId = CrawlerConfigProps.CRAWLER_ENVIRONMENT_ID.getStringOrThrow(config);
        var numThreads = CrawlerConfigProps.CRAWLER_NUM_THREADS.getInt(config);
        var killOfflineConnectorsAfter = Duration.parse(CrawlerConfigProps.CRAWLER_KILL_OFFLINE_CONNECTORS_AFTER.getStringOrThrow(config));
        var maxDataOffers = CrawlerConfigProps.CRAWLER_MAX_DATA_OFFERS_PER_CONNECTOR.getInt(config);
        var maxContractOffers = CrawlerConfigProps.CRAWLER_MAX_CONTRACT_OFFERS_PER_DATA_OFFER.getInt(config);

        return CrawlerConfig.builder()
                .environmentId(environmentId)
                .numThreads(numThreads)
                .killOfflineConnectorsAfter(killOfflineConnectorsAfter)
                .maxDataOffersPerConnector(maxDataOffers)
                .maxContractOffersPerDataOffer(maxContractOffers)
                .build();
    }
}
