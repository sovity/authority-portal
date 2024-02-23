package de.sovity.authorityportal.web.integration.pages

import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.enums.ComponentOnlineStatus
import de.sovity.authorityportal.db.jooq.enums.ComponentType
import de.sovity.authorityportal.web.pages.ComponentStatusApiService
import de.sovity.authorityportal.web.services.ConnectorMetadataService
import de.sovity.authorityportal.web.thirdparty.broker.model.AuthorityPortalConnectorInfo
import de.sovity.authorityportal.web.thirdparty.broker.model.ConnectorOnlineStatus
import de.sovity.authorityportal.web.thirdparty.uptimekuma.model.toDto
import io.quarkus.test.TestTransaction
import io.quarkus.test.junit.QuarkusMock
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.data.Offset
import org.jooq.DSLContext
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito
import org.mockito.Mockito.`when`
import org.mockito.junit.jupiter.MockitoExtension
import java.time.Duration
import java.time.OffsetDateTime

@QuarkusTest
@ExtendWith(MockitoExtension::class)
class ComponentStatusApiServiceTest {

    @Inject
    lateinit var dsl: DSLContext

    @Inject
    lateinit var componentStatusApiService: ComponentStatusApiService

    lateinit var connectorMetadataService: ConnectorMetadataService

    @BeforeEach
    fun setup() {
        connectorMetadataService = Mockito.mock(ConnectorMetadataService::class.java)
        QuarkusMock.installMockForType(connectorMetadataService, ConnectorMetadataService::class.java)
    }

    @Test
    @TestTransaction
    fun getComponentStatusTest() {
        // arrange
        val now = OffsetDateTime.now()
        val env1 = "test"
        val env2 = "dev"
        setupStatusHistory(now, env1, env2)

        `when`(connectorMetadataService.getConnectorInfoByEnvironment(env1)).thenReturn(listOf(
            // online
            AuthorityPortalConnectorInfo().also {
                it.onlineStatus = ConnectorOnlineStatus.ONLINE
                it.offlineSinceOrLastUpdatedAt = now
            },
            AuthorityPortalConnectorInfo().also {
                it.onlineStatus = ConnectorOnlineStatus.ONLINE
                it.offlineSinceOrLastUpdatedAt = now.minus(Duration.ofMinutes(5))
            },
            // disturbed
            AuthorityPortalConnectorInfo().also {
                it.onlineStatus = ConnectorOnlineStatus.OFFLINE
                it.offlineSinceOrLastUpdatedAt = now.minus(Duration.ofSeconds(30))
            },
            AuthorityPortalConnectorInfo().also {
                it.onlineStatus = ConnectorOnlineStatus.DEAD
                it.offlineSinceOrLastUpdatedAt = now.minus(Duration.ofSeconds(60))
            },
            AuthorityPortalConnectorInfo().also {
                it.onlineStatus = ConnectorOnlineStatus.OFFLINE
                it.offlineSinceOrLastUpdatedAt = now.minus(Duration.ofSeconds(90))
            },
            // offline
            AuthorityPortalConnectorInfo().also {
                it.onlineStatus = ConnectorOnlineStatus.OFFLINE
                it.offlineSinceOrLastUpdatedAt = now.minus(Duration.ofMinutes(3))
            }
        ))

        // act
        val resultEnv1 = componentStatusApiService.getComponentsStatus(env1)
        val resultEnv2 = componentStatusApiService.getComponentsStatus(env2)

        // assert
        assertThat(resultEnv1.brokerStatus.componentStatus).isEqualTo(ComponentOnlineStatus.UP.toDto())
        assertThat(resultEnv1.brokerStatus.uptimePercentage).isCloseTo(66.67, Offset.offset(0.1))
        assertThat(resultEnv1.brokerStatus.timeSpan).isEqualTo(Duration.ofDays(30))
        assertThat(resultEnv1.brokerStatus.upSince).isCloseTo(Duration.ofDays(5), Duration.ofSeconds(5))
        assertThat(resultEnv1.dapsStatus.componentStatus).isEqualTo(ComponentOnlineStatus.MAINTENANCE.toDto())
        assertThat(resultEnv1.dapsStatus.uptimePercentage).isCloseTo(50.00, Offset.offset(0.1))
        assertThat(resultEnv1.dapsStatus.timeSpan).isEqualTo(Duration.ofDays(30))
        assertThat(resultEnv1.dapsStatus.upSince).isEqualTo(Duration.ZERO)
        assertThat(resultEnv1.loggingHouseStatus.componentStatus).isEqualTo(ComponentOnlineStatus.PENDING.toDto())
        assertThat(resultEnv1.loggingHouseStatus.uptimePercentage).isEqualTo(0.00)
        assertThat(resultEnv1.loggingHouseStatus.timeSpan).isEqualTo(Duration.ofDays(30))
        assertThat(resultEnv1.loggingHouseStatus.upSince).isEqualTo(Duration.ZERO)
        assertThat(resultEnv1.onlineConnectors).isEqualTo(2)
        assertThat(resultEnv1.disturbedConnectors).isEqualTo(3)
        assertThat(resultEnv1.offlineConnectors).isEqualTo(1)

        assertThat(resultEnv2.brokerStatus.componentStatus).isEqualTo(ComponentOnlineStatus.UP.toDto())
        assertThat(resultEnv2.brokerStatus.uptimePercentage).isEqualTo(100.00)
        assertThat(resultEnv2.brokerStatus.timeSpan).isEqualTo(Duration.ofDays(30))
        assertThat(resultEnv2.brokerStatus.upSince).isCloseTo(Duration.ofDays(31), Duration.ofSeconds(5))
        assertThat(resultEnv2.dapsStatus.componentStatus).isEqualTo(ComponentOnlineStatus.DOWN.toDto())
        assertThat(resultEnv2.dapsStatus.uptimePercentage).isEqualTo(0.00)
        assertThat(resultEnv2.dapsStatus.timeSpan).isEqualTo(Duration.ofDays(30))
        assertThat(resultEnv2.dapsStatus.upSince).isEqualTo(Duration.ZERO)
        assertThat(resultEnv2.loggingHouseStatus).isNull()
    }

    private fun setupStatusHistory(now: OffsetDateTime, environment1: String, environment2: String) {
        val c = Tables.COMPONENT_DOWNTIMES

        dsl.insertInto(c)
            .columns(c.COMPONENT, c.STATUS, c.ENVIRONMENT, c.TIME_STAMP)
            // Environment 1
            // Broker: Uptime starts significantly earlier than 30 days (UP: ~66.67%)
            .values(ComponentType.BROKER, ComponentOnlineStatus.UP, environment1, now.minus(Duration.ofDays(50)))
            .values(ComponentType.BROKER, ComponentOnlineStatus.MAINTENANCE, environment1, now.minus(Duration.ofDays(20)))
            .values(ComponentType.BROKER, ComponentOnlineStatus.UP, environment1, now.minus(Duration.ofDays(15)))
            .values(ComponentType.BROKER, ComponentOnlineStatus.DOWN, environment1, now.minus(Duration.ofDays(10)))
            .values(ComponentType.BROKER, ComponentOnlineStatus.UP, environment1, now.minus(Duration.ofDays(5)))
            // DAPS: First status is "younger" that 30 days (UP: ~50%)
            .values(ComponentType.DAPS, ComponentOnlineStatus.DOWN, environment1, now.minus(Duration.ofDays(16)))
            .values(ComponentType.DAPS, ComponentOnlineStatus.UP, environment1, now.minus(Duration.ofDays(12)))
            .values(ComponentType.DAPS, ComponentOnlineStatus.PENDING, environment1, now.minus(Duration.ofDays(8)))
            .values(ComponentType.DAPS, ComponentOnlineStatus.UP, environment1, now.minus(Duration.ofDays(4)))
            .values(ComponentType.DAPS, ComponentOnlineStatus.MAINTENANCE, environment1, now.minus(Duration.ofMinutes(2)))
            // LH: Never been UP (UP: 0%)
            .values(ComponentType.LOGGING_HOUSE, ComponentOnlineStatus.DOWN, environment1, now.minus(Duration.ofDays(31)))
            .values(ComponentType.LOGGING_HOUSE, ComponentOnlineStatus.MAINTENANCE, environment1, now.minus(Duration.ofDays(20)))
            .values(ComponentType.LOGGING_HOUSE, ComponentOnlineStatus.PENDING, environment1, now.minus(Duration.ofMinutes(5)))
            // Environment 2
            // Broker: Only "UP" status, older than 30 days
            .values(ComponentType.BROKER, ComponentOnlineStatus.UP, environment2, now.minus(Duration.ofDays(31)))
            // DAPS: Only "DOWN" status, older than 30 days
            .values(ComponentType.DAPS, ComponentOnlineStatus.DOWN, environment2, now.minus(Duration.ofDays(31)))
            // LH: Empty
            .execute()

        // TODO: Add tests for Kuma client
        // TODO: Add kuma variable to README (already done?) and .env
    }
}
