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

plugins {
    kotlin("plugin.allopen") version libs.versions.kotlin.get()
    alias(libs.plugins.quarkus)
}

dependencies {
    annotationProcessor(libs.lombok)
    compileOnly(libs.lombok)

    implementation(enforcedPlatform(libs.quarkus.universeBom))
    implementation("io.quarkus:quarkus-scheduler")
    implementation("io.quarkus:quarkus-oidc")
    implementation("io.quarkus:quarkus-keycloak-authorization")
    implementation("io.quarkus:quarkus-elytron-security-properties-file")
    implementation("io.quarkus:quarkus-arc")
    implementation("io.quarkus:quarkus-flyway")
    implementation("io.quarkus:quarkus-narayana-jta")
    implementation("io.quarkus:quarkus-jdbc-postgresql")
    implementation("io.quarkus:quarkus-kotlin")
    implementation("io.quarkus:quarkus-logging-json")
    implementation("io.quarkus:quarkus-opentelemetry")
    implementation("io.quarkus:quarkus-micrometer")
    implementation("io.quarkus:quarkus-resteasy-reactive")
    implementation("io.quarkus:quarkus-resteasy-reactive-jackson")
    implementation("io.quarkus:quarkus-smallrye-context-propagation")
    implementation("io.quarkus:quarkus-smallrye-openapi")
    implementation("io.quarkus:quarkus-smallrye-health")
    implementation("io.quarkus:quarkus-oidc-client-reactive-filter")
    implementation("io.quarkus:quarkus-hibernate-validator")
    implementation("io.quarkus:quarkus-resteasy-reactive-jackson")
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
    implementation("io.opentelemetry.instrumentation:opentelemetry-jdbc")
    implementation("org.bouncycastle:bcprov-jdk18on:1.77")
    implementation("org.bouncycastle:bcpkix-jdk18on:1.77")
    implementation("com.opencsv:opencsv:5.9")
    implementation(libs.quarkus.keycloakAdminClientReactive)
    implementation(libs.quarkus.jooq)
    implementation(libs.commons.lang3)
    implementation(project(":authority-portal-api"))
    implementation(project(":authority-portal-db"))

    testAnnotationProcessor(libs.lombok)
    testCompileOnly(libs.lombok)

    testImplementation("io.rest-assured:rest-assured")
    testImplementation("io.quarkus:quarkus-junit5")
    testImplementation("io.quarkus:quarkus-junit5-mockito") {
        // https://github.com/quarkusio/quarkus/wiki/Migration-Guide-3.0#fixation-of-the-mockito-subclass-mockmaker
        exclude(group = libs.mockito.subclass.get().group, module = libs.mockito.subclass.get().name)
    }
    testImplementation(libs.bundles.assertj)
    testImplementation(libs.awaitility)
    testImplementation(libs.bundles.mockito)
}

quarkus {
    quarkusBuildProperties.set(mapOf(
        "quarkus.datasource.db-version" to libs.versions.postgresDbVersion.get()
    ))
}

tasks.withType<Test> {
    systemProperty("java.util.logging.manager", "org.jboss.logmanager.LogManager")
    maxParallelForks = 1
}

allOpen {
    annotation("jakarta.ws.rs.Path")
    annotation("jakarta.enterprise.context.ApplicationScoped")
    annotation("io.quarkus.test.junit.QuarkusTest")
}

