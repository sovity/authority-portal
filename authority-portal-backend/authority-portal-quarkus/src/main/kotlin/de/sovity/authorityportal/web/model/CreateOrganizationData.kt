package de.sovity.authorityportal.web.model

/**
 * Represents data used for creating an organization.
 */
class CreateOrganizationData {
    var name: String? = null
    var url: String? = null
    var businessUnit: String? = null
    var address: String? = null
    var billingAddress: String? = null
    var taxId: String? = null
    var commerceRegisterNumber: String? = null
    var commerceRegisterLocation: String? = null
    var mainContactName: String? = null
    var mainContactEmail: String? = null
    var mainContactPhone: String? = null
    var techContactName: String? = null
    var techContactEmail: String? = null
    var techContactPhone: String? = null
}
