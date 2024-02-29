import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NgxsModule} from '@ngxs/store';
import {ErrorElementModule} from 'src/app/common/components/error-element/error-element.module';
import {LoadingElementModule} from 'src/app/common/components/loading-element/loading-element.module';
import {PipesAndDirectivesModule} from 'src/app/common/components/pipes-and-directives/pipes-and-directives.module';
import {MaterialModule} from 'src/app/common/material/material.module';
import {SharedModule} from 'src/app/shared/shared.module';
import {ControlCenterUserEditPageComponent} from './control-center-user-edit-page/control-center-user-edit-page.component';
import {ControlCenterUserEditPageStateImpl} from './state/control-center-user-edit-page-state-impl';

@NgModule({
  declarations: [ControlCenterUserEditPageComponent],
  imports: [
    CommonModule,
    RouterModule,

    // NGXS
    NgxsModule.forFeature([ControlCenterUserEditPageStateImpl]),

    MaterialModule,
    SharedModule,
    PipesAndDirectivesModule,
    LoadingElementModule,
    ErrorElementModule,
  ],
})
export class ControlCenterUserEditPageModule {}
