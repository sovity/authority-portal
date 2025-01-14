rootProject.name = "authority-portal-backend"

pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
        mavenLocal()
    }
}

include(":authority-portal-api")
include(":authority-portal-db")
include(":authority-portal-quarkus")
include(":catalog-crawler")
include(":catalog-crawler:catalog-crawler")
include(":catalog-crawler:catalog-crawler-launcher-base")
include(":catalog-crawler:catalog-crawler-ce-launcher")
