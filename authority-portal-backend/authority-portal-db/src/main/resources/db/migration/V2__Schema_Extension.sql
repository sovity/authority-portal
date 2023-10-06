-- User
alter type user_registration_status add value 'INVITED' before 'CREATED';
alter type user_registration_status add value 'DEACTIVATED' after 'REJECTED';
alter type user_registration_status rename value 'APPROVED' to 'ACTIVE';
