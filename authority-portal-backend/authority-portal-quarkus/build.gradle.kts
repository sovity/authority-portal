plugins {
    kotlin("jvm") version "1.9.22"
    kotlin("plugin.allopen") version "1.9.22"
    id("io.quarkus")
}

val quarkusPlatformGroupId: String by project
val quarkusPlatformArtifactId: String by project
val quarkusPlatformVersion: String by project
val assertjVersion: String by project
val mockitoVersion: String by project

dependencies {
    annotationProcessor("org.projectlombok:lombok:1.18.28")
    compileOnly("org.projectlombok:lombok:1.18.28")

    implementation(enforcedPlatform("${quarkusPlatformGroupId}:${quarkusPlatformArtifactId}:${quarkusPlatformVersion}"))
    implementation("io.quarkus:quarkus-scheduler")
    implementation("io.quarkus:quarkus-oidc")
    implementation("io.quarkus:quarkus-keycloak-authorization")
    implementation("io.quarkus:quarkus-keycloak-admin-client-reactive:3.6.6")
    implementation("io.quarkus:quarkus-elytron-security-properties-file")
    implementation("io.quarkus:quarkus-arc")
    implementation("io.quarkus:quarkus-flyway")
    implementation("io.quarkus:quarkus-narayana-jta")
    implementation("io.quarkus:quarkus-jdbc-postgresql")
    implementation("io.quarkus:quarkus-kotlin")
    implementation("io.quarkus:quarkus-micrometer")
    implementation("io.quarkus:quarkus-resteasy-reactive")
    implementation("io.quarkus:quarkus-resteasy-reactive-jackson")
    implementation("io.quarkus:quarkus-smallrye-openapi")
    implementation("io.quarkus:quarkus-smallrye-health")
    implementation("io.quarkus:quarkus-oidc-client-reactive-filter")
    implementation("io.quarkiverse.jooq:quarkus-jooq:2.0.0")
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
    implementation("org.bouncycastle:bcprov-jdk18on:1.77")
    implementation("org.bouncycastle:bcpkix-jdk18on:1.77")
    implementation(project(":authority-portal-api"))
    implementation(project(":authority-portal-db"))
    implementation("io.quarkus:quarkus-hibernate-validator")
    implementation("io.quarkus:quarkus-resteasy-reactive-jackson")
    implementation("com.opencsv:opencsv:5.9")

    testImplementation(project(":authority-portal-api-client"))
    testImplementation("io.rest-assured:rest-assured:3.0.0")
    testImplementation("org.assertj:assertj-core:${assertjVersion}")
    testImplementation("org.mockito:mockito-core:${mockitoVersion}")
    testImplementation("org.mockito:mockito-junit-jupiter:${mockitoVersion}")
    testImplementation("io.quarkus:quarkus-junit5")
    testImplementation("org.mockito.kotlin:mockito-kotlin:5.1.0")
}

configurations.all {
    resolutionStrategy {
        // The quarkus enforced platform uses an outdated okhttp version, but our generated API clients don't
        force("com.squareup.okhttp3:okhttp:4.11.0")
        force("com.squareup.okio:okio:3.2.0")
    }
}

java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}

tasks.withType<Test> {
    systemProperty("java.util.logging.manager", "org.jboss.logmanager.LogManager")
}

allOpen {
    annotation("jakarta.ws.rs.Path")
    annotation("jakarta.enterprise.context.ApplicationScoped")
    annotation("io.quarkus.test.junit.QuarkusTest")
}

tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
    kotlinOptions.jvmTarget = JavaVersion.VERSION_17.toString()
    kotlinOptions.javaParameters = true
}

