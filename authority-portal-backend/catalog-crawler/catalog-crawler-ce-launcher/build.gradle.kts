plugins {
    `java-library`
    id("application")
    alias(libs.plugins.shadow)
}

dependencies {
    implementation(project(":catalog-crawler:catalog-crawler-launcher-base"))

    api(libs.edc.monitorJdkLogger)
    api(libs.edc.apiObservability)

    implementation(libs.edc.oauth2Core)
    implementation(libs.edc.vaultFilesystem)
}

application {
    mainClass.set("de.sovity.edc.ext.catalog.crawler.Main")
}

tasks.withType<com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar> {
    mergeServiceFiles()
    archiveFileName.set("app.jar")
}

group = libs.versions.sovityEdcGroup.get()
