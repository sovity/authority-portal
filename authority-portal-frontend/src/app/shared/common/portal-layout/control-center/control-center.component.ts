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
import {Component, Input, OnChanges} from '@angular/core';
import {AvatarConfig} from '../avatar/avatar.component';
import {ControlCenterModel} from './control-center.model';

@Component({
  selector: 'app-control-center',
  templateUrl: './control-center.component.html',
})
export class ControlCenterComponent implements OnChanges {
  @Input() userData!: ControlCenterModel;
  @Input() logoutUrl!: string;

  userAvatar!: AvatarConfig;
  userMenuOpen = false;

  ngOnChanges(): void {
    this.userAvatar = {
      firstName: this.userData.firstName,
      lastName: this.userData.lastName,
    };
  }
}
