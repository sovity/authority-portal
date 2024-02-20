-- Edit Enum: Remove UserRegistrationStatus.CREATED, UserRegistrationStatus.FIRST_USER
delete
from "user"
where registration_status = 'CREATED'
   or registration_status = 'FIRST_USER';

create type tmp_enum AS ENUM ('INVITED', 'ONBOARDING', 'PENDING', 'ACTIVE', 'REJECTED', 'DEACTIVATED');

alter table "user"
    alter column registration_status type tmp_enum
        using (registration_status::text::tmp_enum);

drop type user_registration_status;

alter type tmp_enum rename to user_registration_status;
