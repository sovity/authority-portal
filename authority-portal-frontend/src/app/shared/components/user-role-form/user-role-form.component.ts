import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Observable, map, startWith, tap} from 'rxjs';
import {UserRoleDto} from '@sovity.de/authority-portal-client';
import {mapRolesToReadableFormat} from 'src/app/core/utils/user-role-utils';

@Component({
  selector: 'app-user-role-form',
  templateUrl: './user-role-form.component.html',
})
export class UserRoleFormComponent implements OnInit, OnChanges {
  @Input() value: UserRoleDto[] = [];
  @Input() options: UserRoleDto[] = [];
  @Input() isEnabled: boolean = false;
  @Output() valuesChanged = new EventEmitter<UserRoleDto[]>();

  separatorKeysCodes: number[] = [ENTER, COMMA];
  roleForm = new FormControl();
  rolesCtrl = new FormControl();
  filteredRoles: Observable<string[]>;
  selectedRoles: UserRoleDto[] = [];
  allRoles: UserRoleDto[] = [];

  @ViewChild('roleInput') roleInput!: ElementRef<HTMLInputElement>;

  constructor() {
    this.selectedRoles = [];
    this.filteredRoles = this.rolesCtrl.valueChanges.pipe(
      startWith(null),
      map((res) => this._filter(this.selectedRoles)),
      tap((res) => this.valuesChanged.emit(this.selectedRoles)),
    );
  }

  ngOnInit(): void {
    this.allRoles = this.allRoles.concat(this.options);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']?.currentValue) {
      this.selectedRoles = this.allRoles.concat(changes['value'].currentValue);
    }
    this.formToggle(this.isEnabled);
  }

  remove(role: string): void {
    const index = this.selectedRoles.indexOf(role as UserRoleDto);
    if (index >= 0) {
      this.selectedRoles.splice(index, 1);
      this.rolesCtrl.updateValueAndValidity();
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (
      event.option.viewValue &&
      !this.selectedRoles.includes(event.option.viewValue as UserRoleDto)
    ) {
      this.selectedRoles.push(event.option.viewValue as UserRoleDto);
    }

    this.roleInput.nativeElement.value = '';
    this.rolesCtrl.setValue(null);
  }

  _filter(rolesToExclude: UserRoleDto[]): UserRoleDto[] {
    return this.allRoles.filter((role) => !rolesToExclude.includes(role));
  }

  mapToReadable(role: string): string {
    return mapRolesToReadableFormat(role);
  }

  formToggle(isEnabled: boolean) {
    isEnabled ? this.roleForm.enable() : this.roleForm.disable();
  }
}
