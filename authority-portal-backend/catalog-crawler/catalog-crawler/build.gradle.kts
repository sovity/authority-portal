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
    api(libs.sovity.edc.config)
    api(project(":authority-portal-db"))

    testAnnotationProcessor(libs.lombok)
    testCompileOnly(libs.lombok)
    testImplementation(libs.sovity.edc.ext.testUtils)
    testImplementation(libs.assertj.core)
    testImplementation(libs.mockito.core)
    testImplementation(libs.restAssured.restAssured)
    testImplementation(libs.testcontainers.testcontainers)
    testImplementation(libs.flyway.core)
    testImplementation(libs.testcontainers.junitJupiter)
    testImplementation(libs.testcontainers.postgresql)
    testImplementation(libs.junit.api)
    testImplementation(libs.jsonAssert)
    testRuntimeOnly(libs.junit.engine)
}

tasks.getByName<Test>("test") {
    useJUnitPlatform()
    maxParallelForks = 1
}
