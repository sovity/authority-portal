package de.sovity.authorityportal.web.utils

class PersonNameUtils {
    companion object {
        /**
         * Splits a person's name into first and last name. The split is done at the right-most white space.
         * A potential second name is wrapped into firstName.
         *
         * @param name the name to split
         * @return a pair of first and last name
         */
        fun splitName(name: String): PersonName {
            val splitIndex = name.lastIndexOf(" ")
            val parts = if (splitIndex == -1) {
                arrayOf(name, "")
            } else {
                arrayOf(name.substring(0, splitIndex), name.substring(splitIndex + 1))
            }
            return PersonName(parts[0], parts[1])
        }
    }

    data class PersonName(val firstName: String, val lastName: String)
}
