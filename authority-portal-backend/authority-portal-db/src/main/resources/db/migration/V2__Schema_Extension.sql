-- Copyright (c) 2024 sovity GmbH
--
-- This program and the accompanying materials are made available under the
-- terms of the Apache License, Version 2.0 which is available at
-- https://www.apache.org/licenses/LICENSE-2.0
--
-- SPDX-License-Identifier: Apache-2.0
--
-- Contributors:
--      sovity GmbH - initial implementation
-- User
alter type user_registration_status add value 'INVITED' before 'CREATED';
alter type user_registration_status add value 'DEACTIVATED' after 'REJECTED';
alter type user_registration_status rename value 'APPROVED' to 'ACTIVE';

alter table "user" add column created_at timestamp with time zone not null default now();

-- Organization
alter type organization_registration_status add value 'INVITED' before 'PENDING';
alter type organization_registration_status rename value 'APPROVED' to 'ACTIVE';

alter table "organization" add column created_at timestamp with time zone not null default now();
