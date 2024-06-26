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
    `java-library`
    alias(libs.plugins.openapiYamlGen) // ./gradlew clean resolve
    alias(libs.plugins.openapiCodegen) // ./gradlew openApiValidate && ./gradlew openApiGenerate
}

dependencies {
    annotationProcessor(libs.lombok)
    compileOnly(libs.lombok)

    api(libs.jakarta.wsRsApi)
    api(libs.jakarta.validation)
    api(libs.swaggerCore.annotations)
    api(libs.sovity.edc.wrapperCommonApi)

    implementation(libs.swaggerCore.jaxrs2)
    implementation(libs.jakarta.servletApi)
}

val openapiFileDir = project.layout.buildDirectory.get().asFile.toString()
val openapiFileFilename = "authority-portal.yaml"
val openapiFile = "$openapiFileDir/$openapiFileFilename"

var typescriptClientOutput = "../authority-portal-api-client-ts/src/generated"

tasks.withType<io.swagger.v3.plugins.gradle.tasks.ResolveTask> {
    outputDir = file(openapiFileDir)
    outputFileName = openapiFileFilename.removeSuffix(".yaml")
    prettyPrint = true
    outputFormat = io.swagger.v3.plugins.gradle.tasks.ResolveTask.Format.YAML
    classpath = sourceSets["main"].runtimeClasspath
}

task<org.openapitools.generator.gradle.plugin.tasks.GenerateTask>("openApiGenerateTypeScriptClient") {
    validateSpec.set(false)
    dependsOn("resolve")
    generatorName.set("typescript-fetch")
    configOptions.set(mutableMapOf(
        "supportsES6" to "true",
        "npmVersion" to libs.versions.npmVersion.get(),
        "typescriptThreePlus" to "true",
    ))

    inputSpec.set(openapiFile)
    val outputDirectory = buildFile.parentFile.resolve(typescriptClientOutput).normalize()
    outputDir.set(outputDirectory.toString())

    doFirst {
        project.delete(fileTree(outputDirectory).exclude("**/.gitignore"))
    }

    doLast {
        outputDirectory.resolve("src/generated").renameTo(outputDirectory)
        project.delete(fileTree(outputDirectory).include(
            ".openapi-generator",
            ".openapi-generator-ignore"
        ))
    }
}

tasks.withType<org.gradle.jvm.tasks.Jar> {
    dependsOn("resolve")
    dependsOn("openApiGenerateTypeScriptClient")
    from(openapiFileDir) {
        include(openapiFileFilename)
    }
}
