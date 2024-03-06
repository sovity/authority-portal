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

import {Component, OnChanges} from '@angular/core';
import {Observable} from 'rxjs';
import {DeploymentEnvironmentDto} from '@sovity.de/authority-portal-client';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';

@Component({
  selector: 'app-env-banner',
  templateUrl: './env-banner.component.html',
})
export class EnvBannerComponent implements OnChanges {
  selectedEnvironment$!: Observable<DeploymentEnvironmentDto>;

  constructor(private globalStateUtils: GlobalStateUtils) {
    this.selectedEnvironment$ =
      this.globalStateUtils.getDeploymentEnvironment();
  }

  ngOnChanges() {}
}
