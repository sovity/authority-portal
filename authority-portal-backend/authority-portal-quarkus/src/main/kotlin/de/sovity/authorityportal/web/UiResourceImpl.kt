package de.sovity.authorityportal.web

import de.sovity.authorityportal.api.UiResource
import de.sovity.authorityportal.api.model.ExamplePageQuery
import de.sovity.authorityportal.api.model.ExamplePageResult
import de.sovity.authorityportal.api.model.UserApprovalPageQuery
import de.sovity.authorityportal.api.model.UserApprovalPageResult
import de.sovity.authorityportal.api.model.UserRoleDto
import de.sovity.authorityportal.web.services.ExamplePageApiService
import de.sovity.authorityportal.web.services.ExampleTableApiService
import de.sovity.authorityportal.web.services.UserApprovalPageApiService
import jakarta.inject.Inject
import jakarta.transaction.Transactional

class UiResourceImpl : UiResource {
    @Inject
    lateinit var examplePageApiService: ExamplePageApiService

    @Inject
    lateinit var exampleTableApiService: ExampleTableApiService

    @Inject
    lateinit var userApprovalPageApiService: UserApprovalPageApiService

    @Transactional
    override fun examplePage(query: ExamplePageQuery): ExamplePageResult {
        return examplePageApiService.examplePage(query)
    }

    @Transactional
    override fun exampleDbQuery(): MutableList<String> {
        return exampleTableApiService.getExampleTableIds().toMutableList();
    }

    @Transactional
    override fun userApprovalPage(query: UserApprovalPageQuery): UserApprovalPageResult {
        return userApprovalPageApiService.userApprovalPage(query)
    }

    @Transactional
    override fun updateUserRole(role: UserRoleDto, userId: String): String {
        return userApprovalPageApiService.updateUserRole(userId, role)
    }
}
