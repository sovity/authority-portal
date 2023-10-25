import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';

const Material = [MatButtonModule, MatIconModule, MatTabsModule];

@NgModule({
  imports: [CommonModule, Material],
  exports: [Material],
})
export class MaterialModule {}
