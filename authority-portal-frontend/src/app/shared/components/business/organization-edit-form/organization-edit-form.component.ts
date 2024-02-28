import {Component, Input, OnDestroy} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {LEGAL_ID_TYPES} from '../organization-create-form/organization-create-form.component';
import {OrganizationEditFormModel} from './organization-edit-form-model';

@Component({
  selector: 'app-organization-edit-form',
  templateUrl: './organization-edit-form.component.html',
})
export class OrganizationEditFormComponent implements OnDestroy {
  @Input()
  orgForm!: FormGroup<OrganizationEditFormModel>;

  idTypes = LEGAL_ID_TYPES;

  ngOnDestroy$ = new Subject();

  ngOnDestroy() {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
