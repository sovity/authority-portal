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
