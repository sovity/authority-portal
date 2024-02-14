import {NgModule} from '@angular/core';
import {AutoResizeDirective} from './autoResize-text-area.directive';
import {CheckIfNotCurrentUserPipe} from './check-if-not-current-user.pipe';
import {FilterByRegistrationStatusPipe} from './filter-by-registration-status.pipe';
import {FormControlErrorDirective} from './form-control-error.directive';
import {HasAnyRolePipe} from './has-any-role.pipe';
import {HasRolePipe} from './has-role.pipe';
import {SentenceCasePipe} from './sentence-case.pipe';

@NgModule({
  declarations: [
    AutoResizeDirective,
    CheckIfNotCurrentUserPipe,
    FilterByRegistrationStatusPipe,
    SentenceCasePipe,
    FormControlErrorDirective,
    HasAnyRolePipe,
    HasRolePipe,
  ],
  exports: [
    AutoResizeDirective,
    CheckIfNotCurrentUserPipe,
    FilterByRegistrationStatusPipe,
    SentenceCasePipe,
    FormControlErrorDirective,
    HasAnyRolePipe,
    HasRolePipe,
  ],
})
export class PipesAndDirectivesModule {}
