package de.sovity.authorityportal.web.thirdparty.uptimekuma

import io.quarkus.rest.client.reactive.QuarkusRestClientBuilder
import jakarta.enterprise.context.ApplicationScoped
import jakarta.enterprise.inject.Produces
import org.eclipse.microprofile.config.inject.ConfigProperty
import java.net.URI

@ApplicationScoped
class UptimeKumaClientResourceFactory {

    @ConfigProperty(name = "authority-portal.kuma.metrics-url")
    lateinit var uptimeKumaUrl: String

    @Produces
    @ApplicationScoped
    fun uptimeKumaRestClient(): UptimeKumaClientResource {
        return QuarkusRestClientBuilder.newBuilder()
            .baseUri(uptimeKumaUrl.let(URI::create))
            .build(UptimeKumaClientResource::class.java)!!
    }
}
