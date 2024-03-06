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
ALTER TABLE "user"
    ADD COLUMN email text,
    ADD COLUMN first_name text,
    ADD COLUMN last_name text,
    ADD COLUMN job_title text,
    ADD COLUMN phone text;

-- Organization
ALTER TABLE "organization"
    ADD COLUMN business_unit text,
    ADD COLUMN billing_address text,
    ADD COLUMN tax_id text,
    ADD COLUMN commerce_register_number text,
    ADD COLUMN commerce_register_location text,
    ADD COLUMN main_contact_name text,
    ADD COLUMN main_contact_email text,
    ADD COLUMN main_contact_phone text,
    ADD COLUMN tech_contact_name text,
    ADD COLUMN tech_contact_email text,
    ADD COLUMN tech_contact_phone text;

UPDATE "organization" SET main_contact_email = security_email;

ALTER TABLE "organization"
    DROP COLUMN duns,
    DROP COLUMN security_email;

