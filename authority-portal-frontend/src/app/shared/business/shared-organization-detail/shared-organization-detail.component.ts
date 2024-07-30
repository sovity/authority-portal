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
import {
  OrganizationDetailsDto,
  OwnOrganizationDetailsDto,
} from '@sovity.de/authority-portal-client';
import {ActiveFeatureSet} from 'src/app/core/services/config/active-feature-set';

@Component({
  selector: 'app-shared-organization-detail',
  templateUrl: './shared-organization-detail.component.html',
})
export class SharedOrganizationDetailComponent {
  @HostBinding('class.flex')
  @HostBinding('class.flex-col')
  @HostBinding('class.my-6')
  @HostBinding('class.@container') // tailwind container queries
  cls = true;

  @Input() organization!: OrganizationDetailsDto | OwnOrganizationDetailsDto;

  constructor(public activeFeatureSet: ActiveFeatureSet) {}
}
