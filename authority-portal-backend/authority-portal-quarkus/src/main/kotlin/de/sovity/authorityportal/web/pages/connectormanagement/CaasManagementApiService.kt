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

package de.sovity.authorityportal.web.pages.connectormanagement

import de.sovity.authorityportal.api.model.CaasAvailabilityResponse
import de.sovity.authorityportal.api.model.CreateCaasRequest
import de.sovity.authorityportal.api.model.CreateConnectorResponse
import de.sovity.authorityportal.db.jooq.enums.CaasStatus
import de.sovity.authorityportal.db.jooq.tables.records.OrganizationRecord
import de.sovity.authorityportal.db.jooq.tables.records.UserRecord
import de.sovity.authorityportal.web.environment.DeploymentEnvironmentService
import de.sovity.authorityportal.web.services.ConnectorService
import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.services.UserService
import de.sovity.authorityportal.web.thirdparty.caas.CaasClient
import de.sovity.authorityportal.web.thirdparty.caas.model.CaasPortalDeploymentDto
import de.sovity.authorityportal.web.utils.PersonNameUtils
import de.sovity.authorityportal.web.utils.TimeUtils
import de.sovity.authorityportal.web.utils.idmanagement.ClientIdUtils
import de.sovity.authorityportal.web.utils.idmanagement.DataspaceComponentIdUtils
import io.quarkus.logging.Log
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.eclipse.microprofile.config.inject.ConfigProperty

@ApplicationScoped
class CaasManagementApiService(
    val organizationService: OrganizationService,
    val dataspaceComponentIdUtils: DataspaceComponentIdUtils,
    val caasClient: CaasClient,
    val connectorService: ConnectorService,
    val deploymentEnvironmentService: DeploymentEnvironmentService,
    val clientIdUtils: ClientIdUtils,
    val userService: UserService,
    val timeUtils: TimeUtils,
    @ConfigProperty(name = "authority-portal.caas.sovity.limit-per-mdsid") val caasLimitPerMdsId: String
) {

    fun createCaas(
        mdsId: String,
        userId: String,
        caasRequest: CreateCaasRequest,
        environmentId: String
    ): CreateConnectorResponse {
        val curatorOrganization = organizationService.getOrganizationOrThrow(mdsId)
        val curatorUser = userService.getUserOrThrow(userId)
        val connectorId = dataspaceComponentIdUtils.generateDataspaceComponentId(mdsId)
        val clientId = clientIdUtils.generateFromConnectorId(connectorId)

        val apDeploymentDto = buildAuthorityPortalDeploymentDto(
            curatorOrganization,
            caasRequest,
            connectorId,
            environmentId,
            clientId,
            curatorUser
        )

        val configAssertion = assertValidConfig(apDeploymentDto, mdsId, environmentId)
        if (!configAssertion.valid) {
            Log.error(configAssertion.message)
            return CreateConnectorResponse.error(configAssertion.message, timeUtils.now())
        }

        caasClient.requestCaas(apDeploymentDto)

        connectorService.createCaas(
            connectorId = connectorId,
            clientId = clientId,
            mdsId = mdsId,
            name = caasRequest.connectorTitle,
            createdBy = userId,
            status = CaasStatus.PROVISIONING,
            environmentId = environmentId
        )

        return CreateConnectorResponse.ok(connectorId, timeUtils.now())
    }

    fun getFreeCaasUsageForOrganization(mdsId: String, environmentId: String): CaasAvailabilityResponse {
        val caasLimit = caasLimitPerMdsId.toInt()
        val caasCount = connectorService.getCaasCountByMdsIdAndEnvironment(mdsId, environmentId)

        return CaasAvailabilityResponse(caasLimit, caasCount)
    }

    private fun assertValidConfig(
        apDeploymentDto: CaasPortalDeploymentDto,
        mdsId: String,
        environmentId: String
    ): ConfigAssertion {
        if (!connectorService.assertCaasRegistrationLimit(mdsId, environmentId)) {
            return ConfigAssertion(false, "Connector limit reached for MDS ID: $mdsId")
        }
        if (!caasClient.validateSubdomain(apDeploymentDto.subdomain.trim())) {
            return ConfigAssertion(
                false,
                "Subdomain ${apDeploymentDto.subdomain} is not available! Please choose a different one."
            )
        }
        return ConfigAssertion(true, "")
    }

    private fun buildAuthorityPortalDeploymentDto(
        curatorOrganization: OrganizationRecord,
        caasRequest: CreateCaasRequest,
        connectorId: String,
        environmentId: String,
        clientId: String,
        curatorUser: UserRecord
    ): CaasPortalDeploymentDto {
        val securityContactName = PersonNameUtils.splitName(curatorOrganization.techContactName)
        return CaasPortalDeploymentDto(
            connectorId = connectorId,
            subdomain = caasRequest.connectorSubdomain.trim(),
            clientId = clientId,
            connectorTitle = caasRequest.connectorTitle.trim(),
            connectorDescription = caasRequest.connectorDescription.trim(),
            participantOrganizationUrl = curatorOrganization.url,
            participantOrganizationLegalName = curatorOrganization.name,
            clearingHouseUrl = deploymentEnvironmentService.findByIdOrThrow(environmentId).loggingHouse().url(),
            brokerUrl = deploymentEnvironmentService.findByIdOrThrow(environmentId).broker().url(),
            dapsTokenUrl = buildDapsTokenUrl(environmentId),
            dapsJwksUrl = buildDapsJwksUrl(environmentId),
            securityContactFirstName = securityContactName.firstName,
            securityContactLastName = securityContactName.lastName,
            securityContactEmail = curatorOrganization.techContactEmail,
            securityContactPhone = curatorOrganization.techContactPhone,
            userContactFirstName = curatorUser.firstName,
            userContactLastName = curatorUser.lastName,
            userContactEmail = curatorUser.email
        )
    }

    private fun buildDapsTokenUrl(environmentId: String): String {
        val daps = deploymentEnvironmentService.findByIdOrThrow(environmentId).daps()
        return daps.url() + "/realms/${daps.realmName()}/protocol/openid-connect/token"
    }

    private fun buildDapsJwksUrl(environmentId: String): String {
        val daps = deploymentEnvironmentService.findByIdOrThrow(environmentId).daps()
        return daps.url() + "/realms/${daps.realmName()}/protocol/openid-connect/certs"
    }

    data class ConfigAssertion(val valid: Boolean, val message: String)
}
