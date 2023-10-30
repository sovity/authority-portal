import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';

const Material = [
  MatButtonModule,
  MatIconModule,
  MatTabsModule,
  MatChipsModule,
  MatFormFieldModule,
  MatAutocompleteModule,
  MatSelectModule,
];

@NgModule({
  imports: [CommonModule, Material],
  exports: [Material],
})
export class MaterialModule {}
