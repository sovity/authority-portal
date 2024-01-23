import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {DeploymentEnvironmentDto} from '@sovity.de/authority-portal-client';
import {GlobalState} from 'src/app/core/global-state/global-state';
import {SwitchEnvironment} from 'src/app/core/global-state/global-state-actions';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';

@Component({
  selector: 'app-env-switcher',
  templateUrl: './env-switcher.component.html',
})
export class EnvSwitcherComponent implements OnInit {
  @Input() deploymentEnvironments: DeploymentEnvironmentDto[] = [];

  selectedEnvironmentId!: string;
  state!: GlobalState;

  constructor(
    public store: Store,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  ngOnInit(): void {
    this.listenToAvailableEnvironments();
    this.setDefaultEnvironment();
  }

  selectEnvironment(environment: DeploymentEnvironmentDto) {
    this.selectedEnvironmentId = environment.environmentId;
    this.store.dispatch(new SwitchEnvironment(environment));
  }

  private listenToAvailableEnvironments() {
    this.globalStateUtils
      .getDeploymentEnvironments()
      .subscribe((environments: DeploymentEnvironmentDto[]) => {
        this.deploymentEnvironments = environments;
      });
  }

  private setDefaultEnvironment() {
    this.globalStateUtils
      .getDeploymentEnvironmentId()
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((environmentId: string) => {
        this.selectedEnvironmentId = environmentId;
      });
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
