package de.sovity.authorityportal.seeds.utils

/**
 * Our Dev User IDs also need to be UUIDs, as they are expected to exist in the keycloak.
 */
fun dummyDevUserUuid(i: Int): String = "00000000-0000-0000-0000-${i.toString().padStart(12, '0')}"
fun dummyDevMdsId(i: Int): String = "MDSL${i.toString().padStart(6, '0')}"
