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
