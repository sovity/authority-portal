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

package de.sovity.authorityportal.broker.services.logging;

import de.sovity.authorityportal.db.jooq.Tables;
import de.sovity.authorityportal.db.jooq.enums.BrokerEventStatus;
import de.sovity.authorityportal.db.jooq.enums.BrokerEventType;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.jooq.DSLContext;

import java.time.OffsetDateTime;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Updates a single connector.
 */
@ApplicationScoped
public class BrokerEventLogger {
    @Inject
    DSLContext dsl;

    public void logConnectorsDeleted(Collection<String> connectorEndpoints) {
        var records = connectorEndpoints.stream().map(connectorEndpoint -> {
            var logEntry = dsl.newRecord(Tables.BROKER_EVENT_LOG);
            logEntry.setEvent(BrokerEventType.CONNECTOR_DELETED);
            logEntry.setEventStatus(BrokerEventStatus.OK);
            logEntry.setConnectorEndpoint(connectorEndpoint);
            logEntry.setCreatedAt(OffsetDateTime.now());
            logEntry.setUserMessage("Connector was deleted.");
            return logEntry;
        }).toList();
        dsl.batchInsert(records).execute();
    }

    public void logConnectorUpdated(String connectorEndpoint, ConnectorChangeTracker changes) {
        var logEntry = dsl.newRecord(Tables.BROKER_EVENT_LOG);
        logEntry.setEvent(BrokerEventType.CONNECTOR_UPDATED);
        logEntry.setEventStatus(BrokerEventStatus.OK);
        logEntry.setConnectorEndpoint(connectorEndpoint);
        logEntry.setCreatedAt(OffsetDateTime.now());
        logEntry.setUserMessage(changes.toString());
        logEntry.insert();
    }

    public void logConnectorOffline(String connectorEndpoint, BrokerEventErrorMessage errorMessage) {
        var logEntry = dsl.newRecord(Tables.BROKER_EVENT_LOG);
        logEntry.setEvent(BrokerEventType.CONNECTOR_STATUS_CHANGE_OFFLINE);
        logEntry.setEventStatus(BrokerEventStatus.ERROR);
        logEntry.setConnectorEndpoint(connectorEndpoint);
        logEntry.setCreatedAt(OffsetDateTime.now());
        logEntry.setUserMessage("Connector is offline.");
        logEntry.setErrorStack(errorMessage.stackTraceOrNull());
        logEntry.insert();
    }

    public void logConnectorOnline(String connectorEndpoint) {
        var logEntry = dsl.newRecord(Tables.BROKER_EVENT_LOG);
        logEntry.setEvent(BrokerEventType.CONNECTOR_STATUS_CHANGE_ONLINE);
        logEntry.setEventStatus(BrokerEventStatus.OK);
        logEntry.setConnectorEndpoint(connectorEndpoint);
        logEntry.setCreatedAt(OffsetDateTime.now());
        logEntry.setUserMessage("Connector is online.");
        logEntry.insert();
    }

    public void logConnectorUpdateDataOfferLimitExceeded(Integer maxDataOffersPerConnector, String endpoint) {
        var logEntry = dsl.newRecord(Tables.BROKER_EVENT_LOG);
        logEntry.setEvent(BrokerEventType.CONNECTOR_DATA_OFFER_LIMIT_EXCEEDED);
        logEntry.setEventStatus(BrokerEventStatus.OK);
        logEntry.setConnectorEndpoint(endpoint);
        logEntry.setUserMessage("Connector has more than %d data offers. Exceeding data offers will be ignored.".formatted(maxDataOffersPerConnector));
        logEntry.setCreatedAt(OffsetDateTime.now());
        logEntry.insert();
    }

    public void logConnectorUpdateDataOfferLimitOk(String endpoint) {
        var logEntry = dsl.newRecord(Tables.BROKER_EVENT_LOG);
        logEntry.setEvent(BrokerEventType.CONNECTOR_DATA_OFFER_LIMIT_OK);
        logEntry.setEventStatus(BrokerEventStatus.OK);
        logEntry.setConnectorEndpoint(endpoint);
        logEntry.setUserMessage("Connector is not exceeding the maximum number of data offers limit anymore.");
        logEntry.setCreatedAt(OffsetDateTime.now());
        logEntry.insert();
    }

    public void logConnectorUpdateContractOfferLimitExceeded(Integer maxContractOffersPerConnector, String endpoint) {
        var logEntry = dsl.newRecord(Tables.BROKER_EVENT_LOG);
        logEntry.setEvent(BrokerEventType.CONNECTOR_CONTRACT_OFFER_LIMIT_EXCEEDED);
        logEntry.setEventStatus(BrokerEventStatus.OK);
        logEntry.setConnectorEndpoint(endpoint);
        logEntry.setUserMessage("Some data offers have more than %d contract offers. Exceeding contract offers will be ignored.: ".formatted(maxContractOffersPerConnector));
        logEntry.setCreatedAt(OffsetDateTime.now());
        logEntry.insert();
    }

    public void logConnectorUpdateContractOfferLimitOk(String endpoint) {
        var logEntry = dsl.newRecord(Tables.BROKER_EVENT_LOG);
        logEntry.setEvent(BrokerEventType.CONNECTOR_CONTRACT_OFFER_LIMIT_OK);
        logEntry.setEventStatus(BrokerEventStatus.OK);
        logEntry.setConnectorEndpoint(endpoint);
        logEntry.setUserMessage("Connector is not exceeding the maximum number of contract offers per data offer limit anymore.");
        logEntry.setCreatedAt(OffsetDateTime.now());
        logEntry.insert();
    }

    public void addKilledDueToOfflineTooLongMessages(List<String> deletedConnectorEndpoints) {
        var logEntries = deletedConnectorEndpoints.stream().map(endpoint -> {
            var logEntry = dsl.newRecord(Tables.BROKER_EVENT_LOG);
            logEntry.setEvent(BrokerEventType.CONNECTOR_KILLED_DUE_TO_OFFLINE_FOR_TOO_LONG);
            logEntry.setEventStatus(BrokerEventStatus.OK);
            logEntry.setCreatedAt(OffsetDateTime.now());
            logEntry.setUserMessage("Connector was marked as dead for being offline too long.");
            logEntry.setConnectorEndpoint(endpoint);
            return logEntry;
        }).collect(Collectors.toList());

        dsl.batchInsert(logEntries).execute();
    }
}
