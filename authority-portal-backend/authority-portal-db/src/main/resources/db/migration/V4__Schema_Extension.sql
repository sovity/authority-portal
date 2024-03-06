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
-- Components
create table "component" (
    id              text primary key,
    mds_id          text                     not null,
    name            text                     not null,
    homepage_url    text,
    endpoint_url    text                     not null,
    environment     text                     not null,
    client_id       text                     not null,
    created_by      text                     not null,
    created_at      timestamp with time zone not null default now(),
    constraint fk_component_created_by foreign key (created_by) references "user" (id),
    constraint fk_component_organization_id foreign key (mds_id) references "organization" (mds_id)
);
