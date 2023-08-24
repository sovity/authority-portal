package de.sovity.authorityportal.web

import de.sovity.authorityportal.web.services.auth.UserViewRequiredRoles


object Roles {
    object UserRoles {
        /**
         * User has the role of an authority admin.
         */
        const val AUTHORITY_ADMIN = "UR_AUTHORITY-PORTAL_AUTHORITY-ADMIN"

        /**
         * User has the role of an authority user.
         */
        const val AUTHORITY_USER = "UR_AUTHORITY-PORTAL_AUTHORITY-USER"

        /**
         * User has the role of a participant admin.
         */
        const val PARTICIPANT_ADMIN = "UR_AUTHORITY-PORTAL_PARTICIPANT-ADMIN"

        /**
         * User has the role of a participant curator.
         */
        const val PARTICIPANT_CURATOR = "UR_AUTHORITY-PORTAL_PARTICIPANT-CURATOR"

        /**
         * User has the role of a participant user.
         */
        const val PARTICIPANT_USER = "UR_AUTHORITY-PORTAL_PARTICIPANT-USER"
    }

    object UserRegistration {
        /**
         * User can query status of pending users.
         */
        val READ = UserViewRequiredRoles("AR_AUTHORITY-PORTAL_USER-REGISTRATION_READ")
    }

    object UserApproval {
        /**
         * User can query pending users.
         */
        val READ = UserViewRequiredRoles("AR_AUTHORITY-PORTAL_USER-APPROVAL-PAGE_READ")

        /**
         * User can update a pending user's role.
         */
        val UPDATE_ROLE = UserViewRequiredRoles("AR_AUTHORITY-PORTAL_USER-APPROVAL-PAGE_UPDATE-ROLE_EXEC")
    }
}
