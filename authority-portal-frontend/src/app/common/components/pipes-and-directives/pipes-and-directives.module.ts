import {NgModule} from '@angular/core';
import {CheckIfNotCurrentUserPipe} from './check-if-not-current-user.pipe';
import {FilterByRegistrationStatusPipe} from './filter-by-registration-status.pipe';
import {HasAnyRolePipe} from './has-any-role.pipe';
import {HasRolePipe} from './has-role.pipe';

@NgModule({
  declarations: [
    HasRolePipe,
    HasAnyRolePipe,
    FilterByRegistrationStatusPipe,
    CheckIfNotCurrentUserPipe,
  ],
  exports: [
    HasRolePipe,
    HasAnyRolePipe,
    FilterByRegistrationStatusPipe,
    CheckIfNotCurrentUserPipe,
  ],
})
export class PipesAndDirectivesModule {}
