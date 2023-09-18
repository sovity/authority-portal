package de.sovity.authorityportal.web

object Roles {
    object UserRoles {
        /**
         * User has the role of an operator admin.
         */
        const val OPERATOR_ADMIN = "UR_AUTHORITY-PORTAL_OPERATOR-ADMIN"

        /**
         * User has the role of a service partner admin.
         */
        const val SERVICEPARTNER_ADMIN = "UR_AUTHORITY-PORTAL_SERVICEPARTNER-ADMIN"

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
}
