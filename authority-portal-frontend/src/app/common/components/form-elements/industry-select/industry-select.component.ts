import {Component, HostBinding, Input} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-industry-select',
  templateUrl: './industry-select.component.html',
})
export class IndustrySelectComponent {
  @HostBinding('class.flex')
  @HostBinding('class.flex-col')
  @HostBinding('class.flex-1')
  cls = true;

  @Input()
  label: string = 'Industry';

  @Input()
  ctrl: FormControl<string | null> = new FormControl();

  @Input()
  ctrlId = 'industry';

  industries = [
    'Automotive industry',
    'Consulting',
    'Electrical engineering',
    'E-Mobility',
    'Energy industry',
    'Finance',
    'Geodata',
    'Government',
    'Information and communication technology',
    'Infrastructure operator',
    'Insurance industry',
    'Logistics',
    'Meteorological services',
    'Micromobility provider',
    'Municipality',
    'Other',
    'Passenger transportation',
    'Research & Development',
    'Sensor supplier',
    'Software development',
    'Telecommunication',
    'Tourism',
    'Traffic engineering',
  ];
}
