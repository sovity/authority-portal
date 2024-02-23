package de.sovity.authorityportal.web.thirdparty.uptimekuma.model

enum class ComponentStatus(val intValue: Int) {
    UP(1),
    DOWN(0),
    PENDING(2),
    MAINTENANCE(3);

    companion object {
        private val map = entries.associateBy(ComponentStatus::intValue)
        fun fromInt(value: Int): ComponentStatus? = map[value]
    }
}
