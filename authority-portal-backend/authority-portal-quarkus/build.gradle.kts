plugins {
    kotlin("jvm") version "1.8.22"
    kotlin("plugin.allopen") version "1.8.22"
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
    implementation("io.quarkus:quarkus-oidc")
    implementation("io.quarkus:quarkus-keycloak-authorization")
    implementation("io.quarkus:quarkus-keycloak-admin-client-reactive")
    implementation("io.quarkus:quarkus-arc")
    implementation("io.quarkus:quarkus-flyway")
    implementation("io.quarkus:quarkus-narayana-jta")
    implementation("io.quarkus:quarkus-jdbc-postgresql")
    implementation("io.quarkus:quarkus-kotlin")
    implementation("io.quarkus:quarkus-micrometer")
    implementation("io.quarkus:quarkus-resteasy-reactive")
    implementation("io.quarkus:quarkus-resteasy-reactive-jackson")
    implementation("io.quarkus:quarkus-smallrye-openapi")
    implementation("io.quarkiverse.jooq:quarkus-jooq:2.0.0")
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
    implementation(project(":authority-portal-api"))
    implementation(project(":authority-portal-db"))


    testImplementation(project(":authority-portal-api-client"))

    testImplementation("org.assertj:assertj-core:${assertjVersion}")
    testImplementation("org.mockito:mockito-core:${mockitoVersion}")
    testImplementation("org.mockito:mockito-junit-jupiter:${mockitoVersion}")
    testImplementation("io.quarkus:quarkus-junit5")
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
