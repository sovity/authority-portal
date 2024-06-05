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

package de.sovity.authorityportal.broker.services;

import de.sovity.authorityportal.broker.db.DslContextFactory;
import de.sovity.authorityportal.broker.services.schedules.QuartzScheduleInitializer;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class BrokerServerInitializer {
    private final DslContextFactory dslContextFactory;
    private final KnownConnectorsInitializer knownConnectorsInitializer;
    private final QuartzScheduleInitializer quartzScheduleInitializer;

    public void onStartup() {
        dslContextFactory.transaction(knownConnectorsInitializer::addKnownConnectorsOnStartup);
        quartzScheduleInitializer.startSchedules();
    }
}
