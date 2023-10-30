import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {DeploymentEnvironmentDto} from '@sovity.de/authority-portal-client';
import {SwitchEnvironment} from 'src/app/core/global-state/global-state-actions';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';

export const ENV: string[] = ['Development', 'Staging', 'Production'];
@Component({
  selector: 'app-env-switcher',
  templateUrl: './env-switcher.component.html',
})
export class EnvSwitcherComponent implements OnInit {
  @Input() deploymentEnvironments: DeploymentEnvironmentDto[] = [];
  envControl: FormControl<string>;

  constructor(public store: Store, private globalStateUtils: GlobalStateUtils) {
    this.envControl = new FormControl<string>('') as FormControl<string>;
  }

  ngOnInit(): void {
    this.setDefaultEnvironment();
    this.startListeningToForm();
  }

  startListeningToForm() {
    this.envControl.valueChanges
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((value) => {
        const selectedEnvironment = this.deploymentEnvironments.find(
          (env) => env.environmentId === value,
        );
        if (selectedEnvironment)
          this.store.dispatch(new SwitchEnvironment(selectedEnvironment));
      });
  }

  setDefaultEnvironment() {
    this.globalStateUtils
      .getDeploymentEnvironmentId()
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((value) => {
        this.envControl.setValue(value);
      });
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
