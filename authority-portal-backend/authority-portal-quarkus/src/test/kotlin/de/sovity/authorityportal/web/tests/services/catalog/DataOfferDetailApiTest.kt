package de.sovity.authorityportal.web.tests.services.catalog

import com.fasterxml.jackson.databind.ObjectMapper
import de.sovity.authorityportal.broker.api.BrokerServerResource
import de.sovity.authorityportal.broker.api.model.DataOfferDetailPageQuery
import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.seeds.utils.ScenarioData
import de.sovity.authorityportal.seeds.utils.ScenarioInstaller
import de.sovity.authorityportal.seeds.utils.dummyDevAssetId
import de.sovity.authorityportal.seeds.utils.dummyDevConnectorId
import de.sovity.authorityportal.seeds.utils.dummyDevContractOfferId
import de.sovity.authorityportal.seeds.utils.dummyDevMdsId
import de.sovity.authorityportal.web.environment.CatalogDataspaceConfig
import de.sovity.authorityportal.web.environment.CatalogDataspaceConfigService
import de.sovity.authorityportal.web.tests.useDevUser
import de.sovity.edc.ext.wrapper.api.common.model.UiAsset
import io.quarkus.test.InjectMock
import io.quarkus.test.TestTransaction
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.assertj.core.api.Assertions.assertThat
import org.jooq.DSLContext
import org.jooq.JSONB
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.any
import org.mockito.kotlin.whenever
import java.time.OffsetDateTime

@QuarkusTest
@ExtendWith(MockitoExtension::class)
class DataOfferDetailApiTest {

    @Inject
    lateinit var brokerServerResource: BrokerServerResource

    @Inject
    lateinit var scenarioInstaller: ScenarioInstaller

    @Inject
    lateinit var objectMapper: ObjectMapper

    @Inject
    lateinit var dsl: DSLContext

    @InjectMock
    lateinit var catalogDataspaceConfigService: CatalogDataspaceConfigService

    @Test
    @TestTransaction
    fun `test queryDataOfferDetails`() {
        // arrange
        useDevUser(0, 0)

        val uiAsset1 = UiAsset().also {
            it.assetId = dummyDevAssetId(0)
            it.title = "Data Offer 0"
            it.dataCategory = "Data Category 0"
            it.description = "Data Offer 0 Description"
        }

        val uiAsset2 = UiAsset().also {
            it.assetId = dummyDevAssetId(1)
            it.title = "Data Offer 1"
            it.dataCategory = "Data Category 1"
            it.description = "Data Offer 1 Description"
        }

        ScenarioData().apply {
            organization(0, 0)
            user(0, 0)

            connector(0, 0, 0) {
                it.endpointUrl = "https://connector/dsp"
            }
            dataOffer(0, 0, 0) {
                it.uiAssetJson = JSONB.valueOf(objectMapper.writeValueAsString(uiAsset1))
            }
            contractOffer(0, 0, 0, 0)

            connector(1, 0, 0)
            dataOffer(1, 0, 1) {
                it.uiAssetJson = JSONB.valueOf(objectMapper.writeValueAsString(uiAsset2))
            }
            contractOffer(1, 0, 1, 1)

            scenarioInstaller.install(this)
        }

        createDataOfferView(
            datetime = OffsetDateTime.now().minusDays(1),
            connectorId = "${dummyDevMdsId(0)}.${dummyDevConnectorId(0)}",
            assetId = dummyDevAssetId(0)
        )
        createDataOfferView(
            datetime = OffsetDateTime.now().minusDays(2),
            connectorId = "${dummyDevMdsId(0)}.${dummyDevConnectorId(0)}",
            assetId = dummyDevAssetId(0)
        )

        whenever(catalogDataspaceConfigService.forEnvironment(any())).thenReturn(
            CatalogDataspaceConfig(
                namesByConnectorId = mapOf(
                    "${dummyDevMdsId(0)}.${dummyDevConnectorId(1)}" to "Dataspace 1",
                    "${dummyDevMdsId(0)}.${dummyDevConnectorId(2)}" to "Dataspace 2"
                ),
                defaultName = "MDS"
            )
        )

        // act
        val result = brokerServerResource.dataOfferDetailPage(
            environment = "test",
            query = DataOfferDetailPageQuery(
                connectorId = "${dummyDevMdsId(0)}.${dummyDevConnectorId(0)}",
                assetId = dummyDevAssetId(0)
            )
        )

        // assert
        assertThat(result.assetId).isEqualTo(dummyDevAssetId(0))
        assertThat(result.connectorEndpoint).isEqualTo("https://connector/dsp")
        assertThat(result.asset.dataCategory).isEqualTo("Data Category 0")
        assertThat(result.asset.title).isEqualTo("Data Offer 0")
        assertThat(result.asset.description).isEqualTo("Data Offer 0 Description")
        assertThat(result.contractOffers).hasSize(1)
        assertThat(result.contractOffers.first().contractOfferId).isEqualTo(dummyDevContractOfferId(0))
        assertThat(result.contractOffers.first().contractPolicy.constraints).isEmpty()
        assertThat(result.contractOffers.first().contractPolicy.errors).isEmpty()
        assertThat(result.viewCount).isEqualTo(2)
    }

    private fun createDataOfferView(datetime: OffsetDateTime, connectorId: String, assetId: String) {
        dsl.newRecord(Tables.DATA_OFFER_VIEW_COUNT).also {
            it.assetId = assetId
            it.connectorId = connectorId
            it.date = datetime
            it.store()
        }
    }
}
