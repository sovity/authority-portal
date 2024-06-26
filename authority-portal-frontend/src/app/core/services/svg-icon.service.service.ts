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
import {Injectable} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SvgIconServiceService {
  private readonly basePath = 'assets/icons/';
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ) {}

  /**
   * this method takes in list of icons and registers them on matIconRegistry
   * @param iconNames List of icons saved in the assets/icons folder
   */
  initializeIcons(iconNames: string[]): void {
    iconNames.forEach((iconName) => {
      const filePath = `${this.basePath}${iconName}_icon.svg`;
      this.addSvgIcon(iconName, filePath);
    });
  }

  /**
   * register icon on matIconRegistry
   * @param iconName
   * @param filePath
   */
  private addSvgIcon(iconName: string, filePath: string): void {
    this.matIconRegistry.addSvgIcon(
      iconName,
      this.domSanitizer.bypassSecurityTrustResourceUrl(filePath),
    );
  }
}
