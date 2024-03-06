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

import {Component, HostBinding, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {OrganizationOverviewEntryDto} from '@sovity.de/authority-portal-client';
import {Fetched} from '../../../../core/utils/fetched';

@Component({
  selector: 'app-organization-select',
  templateUrl: './organization-select.component.html',
})
export class OrganizationSelectComponent {
  @HostBinding('class.flex')
  @HostBinding('class.flex-col')
  @HostBinding('class.justify-between')
  @HostBinding('class.items-center')
  cls = true;

  @Input()
  label = 'Organization';

  @Input()
  ctrl: FormControl<OrganizationOverviewEntryDto | null> = new FormControl();

  @Input()
  ctrlId = 'organization';

  @Input()
  organizations: Fetched<OrganizationOverviewEntryDto[]> = Fetched.loading();

  compareWith = (
    o1: OrganizationOverviewEntryDto | null,
    o2: OrganizationOverviewEntryDto | null,
  ) => o1?.mdsId === o2?.mdsId;
}
