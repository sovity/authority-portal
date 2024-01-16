package de.sovity.authorityportal.web.pages.usermanagement

import com.opencsv.CSVWriter
import de.sovity.authorityportal.web.services.OrganizationService
import de.sovity.authorityportal.web.services.UserDetailService
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream

@ApplicationScoped
class UserDetailsCsvApiService {

    @Inject
    lateinit var userDetailService: UserDetailService

    @Inject
    lateinit var organizationService: OrganizationService

    @Inject
    lateinit var userRoleMapper: UserRoleMapper

    fun generateUserDetailsCsv(mdsId: String): ByteArrayInputStream {
        val organization = organizationService.getOrganizationOrThrow(mdsId)
        val userDetails = userDetailService.getUserDetailsByOrganization(mdsId)

        val csvHeaders = arrayOf("USER ID", "Organization Name", "Last Name", "First Name", "Roles", "Email", "Job Title", "Registration Status")
        val csvData = mutableListOf(csvHeaders)

        userDetails.forEach {
            csvData.add(arrayOf(
                it.userId, organization.name, it.lastName, it.firstName, userRoleMapper.getUserRoles(it.roles).toString(),
                it.email, it.position ?: "", it.registrationStatus.literal,
            ))
        }

        val outputStream = ByteArrayOutputStream()
        CSVWriter(outputStream.writer()).use { csvWriter ->
            csvWriter.writeAll(csvData)
        }
        return ByteArrayInputStream(outputStream.toByteArray())
    }
}
