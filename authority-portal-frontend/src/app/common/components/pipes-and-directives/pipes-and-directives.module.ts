import {NgModule} from '@angular/core';
import {FilterByRegistrationStatusPipe} from './filter-by-registration-status.pipe';
import {HasAnyRolePipe} from './has-any-role.pipe';
import {HasRolePipe} from './has-role.pipe';

@NgModule({
  declarations: [HasRolePipe, HasAnyRolePipe, FilterByRegistrationStatusPipe],
  exports: [HasRolePipe, HasAnyRolePipe, FilterByRegistrationStatusPipe],
})
export class PipesAndDirectivesModule {}
