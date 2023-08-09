plugins {
    `java-library`
    `maven-publish`
    id("io.swagger.core.v3.swagger-gradle-plugin") version "2.2.15" //./gradlew clean resolve
    id("org.hidetake.swagger.generator") version "2.19.2" //./gradlew generateSwaggerUI
    id("org.openapi.generator") version "6.6.0" //./gradlew openApiValidate && ./gradlew openApiGenerate
}

dependencies {
    annotationProcessor("org.projectlombok:lombok:1.18.28")
    compileOnly("org.projectlombok:lombok:1.18.28")

    api("jakarta.ws.rs:jakarta.ws.rs-api:3.1.0")
    api("jakarta.validation:jakarta.validation-api:3.0.2")
    api("io.swagger.core.v3:swagger-annotations-jakarta:2.2.15")

    implementation("io.swagger.core.v3:swagger-jaxrs2-jakarta:2.2.15")
    implementation("jakarta.servlet:jakarta.servlet-api:5.0.0")
    implementation("org.apache.commons:commons-lang3:3.12.0")
}

val openapiFileDir = "${project.buildDir}/openapi"
val openapiFileFilename = "authority-portal.yaml"
val openapiFile = "$openapiFileDir/$openapiFileFilename"

var typescriptClientOutput = "../authority-portal-api-client-ts/src/generated"

tasks.withType<io.swagger.v3.plugins.gradle.tasks.ResolveTask> {
    outputDir = file(openapiFileDir)
    outputFileName = openapiFileFilename.removeSuffix(".yaml")
    prettyPrint = true
    outputFormat = io.swagger.v3.plugins.gradle.tasks.ResolveTask.Format.YAML
    classpath = java.sourceSets["main"].runtimeClasspath
    buildClasspath = classpath
    resourcePackages = setOf("")
}

task<org.openapitools.generator.gradle.plugin.tasks.GenerateTask>("openApiGenerateTypeScriptClient") {
    validateSpec.set(false)
    dependsOn("resolve")
    generatorName.set("typescript-fetch")
    configOptions.set(
        mutableMapOf(
            "supportsES6" to "true",
            "npmVersion" to "8.15.0",
            "typescriptThreePlus" to "true",
        )
    )

    inputSpec.set(openapiFile)
    val outputDirectory = buildFile.parentFile.resolve(typescriptClientOutput).normalize()
    outputDir.set(outputDirectory.toString())

    doFirst {
        project.delete(fileTree(outputDirectory).exclude("**/.gitignore"))
    }

    doLast {
        outputDirectory.resolve("src/generated").renameTo(outputDirectory)
    }
}

tasks.withType<org.gradle.jvm.tasks.Jar> {
    dependsOn("resolve")
    dependsOn("openApiGenerateTypeScriptClient")
    from(openapiFileDir) {
        include(openapiFileFilename)
    }
}

val authorityPortalGroup: String by project
val authorityPortalVersion: String by project
group = authorityPortalGroup
version = authorityPortalVersion

publishing {
    publications {
        create<MavenPublication>(project.name) {
            from(components["java"])
        }
    }
}
