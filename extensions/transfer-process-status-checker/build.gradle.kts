plugins {
    `java-library`
    `maven-publish`
}

dependencies {
    api(libs.edc.transferSpi)
    testImplementation(libs.edc.junit)
}

group = libs.versions.sovityEdcExtensionGroup.get()

publishing {
    publications {
        create<MavenPublication>(project.name) {
            from(components["java"])
        }
    }
}
