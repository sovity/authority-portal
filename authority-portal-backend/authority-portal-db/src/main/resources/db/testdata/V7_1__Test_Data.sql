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
update "organization"
set
    industry = 'Finance'
where mds_id in ('MDSL1234ZZ', 'MDSL1111AA', 'MDSL2222BB', 'MDSL3333CC', 'MDSL3331C1', 'MDSL3332C2', 'MDSL3333C3', 'MDSL3334C4', 'MDSL2222CC');
