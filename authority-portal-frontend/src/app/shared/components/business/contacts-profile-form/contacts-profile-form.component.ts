import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {ContactsProfileCreateFormModel} from '../../../../pages/registration-process-wizard/sub-pages/organization-create-page/organization-create-page-form-model';

@Component({
  selector: 'app-contacts-profile-form',
  templateUrl: './contacts-profile-form.component.html',
})
export class ContactsProfileFormComponent implements OnInit, OnDestroy {
  @Input()
  mainContactFormGroup!: FormGroup<ContactsProfileCreateFormModel>;

  @Input()
  technicalContactFormGroup!: FormGroup<ContactsProfileCreateFormModel>;

  contactsManagementForm!: FormControl;
  showTechnicalContact: boolean = true;

  ngOnInit(): void {
    this.contactsManagementForm = new FormControl(!this.showTechnicalContact);
    this.startListeningToContactForm();
  }

  startListeningToContactForm() {
    this.contactsManagementForm.valueChanges
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((value) => this.manageContacts(!value));
  }

  manageContacts(showTechnicalContact: boolean) {
    this.showTechnicalContact = showTechnicalContact;
    if (!showTechnicalContact) {
      this.technicalContactFormGroup.patchValue(
        this.mainContactFormGroup.value || {
          firstName: '',
          lastName: '',
          phoneNumber: '',
          email: '',
        },
      );
      this.mainContactFormGroup?.statusChanges
        .pipe(takeUntil(this.ngOnDestroy$))
        .subscribe((status) => {
          if (status) {
            this.technicalContactFormGroup.patchValue(
              this.mainContactFormGroup.value || {
                firstName: '',
                lastName: '',
                phoneNumber: '',
                email: '',
              },
            );
          }
        });
    } else {
      this.technicalContactFormGroup.reset();
    }
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy() {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
