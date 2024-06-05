import org.gradle.api.tasks.testing.logging.TestExceptionFormat
import org.gradle.api.tasks.testing.logging.TestLogEvent

plugins {
    id("java")
    id("checkstyle")
    id("maven-publish")
}

allprojects {
    apply(plugin = "java")
    apply(plugin = "checkstyle")
    apply(plugin = "maven-publish")

    group = "de.sovity.authority-portal"
    version = "0.0.1-SNAPSHOT"

    repositories {
        mavenCentral()
        mavenLocal()

        maven {
            url = uri("https://oss.sonatype.org/content/repositories/snapshots/")
        }
        maven {
            url = uri("https://maven.pkg.github.com/truzzt/mds-ap3")
            credentials {
                username = project.findProperty("gpr.user") as String? ?: System.getenv("USERNAME")
                password = project.findProperty("gpr.key") as String? ?: System.getenv("TOKEN")
            }
        }
        maven {
            url = uri("https://maven.pkg.github.com/ids-basecamp/ids-infomodel-java")
            credentials {
                username = project.findProperty("gpr.user") as String? ?: System.getenv("USERNAME")
                password = project.findProperty("gpr.key") as String? ?: System.getenv("TOKEN")
            }
        }
        maven {
            url = uri("https://pkgs.dev.azure.com/sovity/41799556-91c8-4df6-8ddb-4471d6f15953/_packaging/core-edc/maven/v1")
            name = "AzureRepo"
        }

        maven {
            name = "maven.pkg.github.com/sovity/edc-extensions"
            url = uri("https://maven.pkg.github.com/sovity/edc-extensions")
            credentials {
                username = project.findProperty("gpr.user") as String? ?: System.getenv("GPR_USER")
                password = project.findProperty("gpr.key") as String? ?: System.getenv("GPR_KEY")
            }
        }
    }

    tasks.withType<JavaCompile> {
        options.encoding = "UTF-8"
        sourceCompatibility = JavaVersion.VERSION_17.toString()
        targetCompatibility = JavaVersion.VERSION_17.toString()
    }

    checkstyle {
        toolVersion = "9.0"
        configFile = rootProject.file("docs/dev/checkstyle/checkstyle-config.xml")
        configDirectory.set(rootProject.file("docs/dev/checkstyle"))
        maxErrors = 0 // does not tolerate errors
    }

    tasks.withType<Test> {
        testLogging {
            events = setOf(TestLogEvent.FAILED)
            exceptionFormat = TestExceptionFormat.FULL
        }
    }

    publishing {
        repositories {
            maven {
                name = "GitHubPackages"
                url = uri("https://maven.pkg.github.com/sovity/authority-portal")
                credentials {
                    username = project.findProperty("gpr.user") as String? ?: System.getenv("USERNAME")
                    password = project.findProperty("gpr.key") as String? ?: System.getenv("TOKEN")
                }
            }
        }
    }
}
