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
