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
        const val SERVICE_PARTNER_ADMIN = "UR_AUTHORITY-PORTAL_SERVICE_PARTNER-ADMIN"

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
