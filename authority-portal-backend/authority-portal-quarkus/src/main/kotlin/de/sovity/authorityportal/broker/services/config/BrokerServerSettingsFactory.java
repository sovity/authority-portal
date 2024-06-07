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

package de.sovity.authorityportal.broker.services.config;

import de.sovity.authorityportal.web.environment.DeploymentEnvironmentConfiguration;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Produces;
import jakarta.inject.Inject;
import org.apache.commons.lang3.StringUtils;

import java.util.Arrays;
import java.util.List;

@ApplicationScoped
public class BrokerServerSettingsFactory {

    @Inject
    DeploymentEnvironmentConfiguration deploymentEnvironmentConfiguration;

    @Produces
    @ApplicationScoped
    public BrokerServerDataspaceSettings brokerServerDataspaceSettings() {
        var dataSpaceConfig = buildDataSpaceConfig();

        return BrokerServerDataspaceSettings.builder()
                .dataSpaceConfig(dataSpaceConfig)
                .build();
    }

    private DataSpaceConfig buildDataSpaceConfig() {
        var dataSpaceConfig = new DataSpaceConfig(getKnownDataSpaceEndpoints(), deploymentEnvironmentConfiguration.global().broker().defaultDataspace());
        Log.info("Default Dataspace Name: %s".formatted(dataSpaceConfig.defaultDataSpace()));
        dataSpaceConfig.dataSpaceConnectors().forEach(dataSpaceConnector -> Log.info("Using Dataspace Name %s for %s."
                .formatted(dataSpaceConnector.dataSpaceName(), dataSpaceConnector.endpoint())));
        if (dataSpaceConfig.dataSpaceConnectors().isEmpty()) {
            Log.info("No additional data space names configured.");
        }
        return dataSpaceConfig;
    }

    private List<DataSpaceConnector> getKnownDataSpaceEndpoints() {
        // Example: "Example1=http://connector-endpoint1.org,Example2=http://connector-endpoint2.org"
        var dataSpacesConfig = deploymentEnvironmentConfiguration.global().broker().knownDataSpaceConnectors();
        if (dataSpacesConfig == null) {
            return List.of();
        }

        return Arrays.stream(dataSpacesConfig.split(","))
                .map(String::trim)
                .map(it -> it.split("="))
                .filter(it -> it.length == 2)
                .map(it -> {
                    var dataSpaceName = it[0].trim();
                    var dataSpaceEndpoint = it[1].trim();
                    return new DataSpaceConnector(dataSpaceEndpoint, dataSpaceName);
                })
                .filter(it -> StringUtils.isNotBlank(it.endpoint()) && StringUtils.isNotBlank(it.endpoint()))
                .toList();
    }
}
