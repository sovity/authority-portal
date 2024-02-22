import {NgModule} from '@angular/core';
import {CheckIfNotCurrentUserPipe} from './check-if-not-current-user.pipe';
import {DisabledButtonDirective} from './disabled-button.directive';
import {FilterByRegistrationStatusPipe} from './filter-by-registration-status.pipe';
import {FormControlErrorDirective} from './form-control-error.directive';
import {HasAnyRolePipe} from './has-any-role.pipe';
import {HasRolePipe} from './has-role.pipe';
import {SentenceCasePipe} from './sentence-case.pipe';

@NgModule({
  declarations: [
    CheckIfNotCurrentUserPipe,
    FilterByRegistrationStatusPipe,
    SentenceCasePipe,
    FormControlErrorDirective,
    HasAnyRolePipe,
    HasRolePipe,
    DisabledButtonDirective,
  ],
  exports: [
    CheckIfNotCurrentUserPipe,
    FilterByRegistrationStatusPipe,
    SentenceCasePipe,
    FormControlErrorDirective,
    HasAnyRolePipe,
    HasRolePipe,
    DisabledButtonDirective,
  ],
})
export class PipesAndDirectivesModule {}
