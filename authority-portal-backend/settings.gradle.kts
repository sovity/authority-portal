rootProject.name = "authority-portal-backend"

pluginManagement {
    val quarkusPluginVersion: String by settings
    val quarkusPluginId: String by settings
    repositories {
        mavenCentral()
        gradlePluginPortal()
        mavenLocal()
    }
    plugins {
        id(quarkusPluginId) version quarkusPluginVersion
    }
}

include(":authority-portal-api")
include(":authority-portal-api-client")
include(":authority-portal-db")
include(":authority-portal-quarkus")
