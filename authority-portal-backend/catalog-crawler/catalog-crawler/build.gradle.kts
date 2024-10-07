plugins {
    `java-library`
}

dependencies {
    annotationProcessor(libs.lombok)
    compileOnly(libs.lombok)

    implementation(libs.edc.controlPlaneSpi)
    implementation(libs.edc.managementApiConfiguration)

    implementation(libs.quartz.quartz)
    implementation(libs.commons.lang3)

    api(libs.sovity.edc.catalogParser)
    api(libs.sovity.edc.jsonAndJsonLdUtils)
    api(libs.sovity.edc.wrapperCommonMappers)
    api(libs.sovity.edc.ext.postgresFlywayCore)
    api(project(":catalog-crawler:catalog-crawler-db"))
}
