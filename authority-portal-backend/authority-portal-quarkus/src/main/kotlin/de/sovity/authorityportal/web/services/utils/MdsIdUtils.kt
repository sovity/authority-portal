package de.sovity.authorityportal.web.services.utils

import de.sovity.authorityportal.db.jooq.Tables
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.jooq.DSLContext
import java.util.UUID

@ApplicationScoped
class MdsIdUtils {
    @Inject
    lateinit var dsl: DSLContext

    fun generateMdsId(): String {
        val usedMdsIds = getUsedMdsIds()
        var mdsId: String

        do {
            mdsId = getMdsIdCandidate()
        } while (usedMdsIds.contains(mdsId))

        return mdsId
    }

    private fun getMdsIdCandidate(): String {
        val prefix = "MDSL"
        val identifier = randomIdentifier()
        val checksum = calculateVerificationDigits(identifier)
        return "$prefix$identifier$checksum"
    }

    private fun randomIdentifier(): String {
        return UUID.randomUUID().toString().filterNot { it == '-' }.substring(0, 10).uppercase()
    }

    private fun getUsedMdsIds(): Set<String> {
        val o = Tables.ORGANIZATION
        return dsl.select(o.MDS_ID).from(o)
            .fetchSet(o.MDS_ID)
    }

    private fun calculateVerificationDigits(id: String): String {
        val chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        val m = 1271
        val r = 36
        val input = id.uppercase()

        var product = 0
        for (char in input) {
            val value = chars.indexOf(char)
            product = ((product + value) * r) % m
        }

        product = (product * r) % m
        val checksum = (m - product + 1) % m
        val secondDigit = checksum % r
        val firstDigit = (checksum - secondDigit) / r

        return chars[firstDigit].toString() + chars[secondDigit].toString()
    }
}
