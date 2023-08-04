package de.sovity.authorityportal.web.services

import de.sovity.authorityportal.db.jooq.Tables
import de.sovity.authorityportal.db.jooq.enums.MyExampleStatus
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.jooq.DSLContext

@ApplicationScoped
class ExampleTableApiService {
    @Inject
    lateinit var dsl: DSLContext

    /**
     * Example DB Access
     */
    fun getExampleTableIds(): List<String> {
        val e = Tables.MY_EXAMPLE
        return dsl.select(e.ID).from(e)
                .where(e.STATUS.eq(MyExampleStatus.OK))
                .fetchSet(e.ID).toList().sorted();
    }

}