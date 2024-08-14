import {Pipe, PipeTransform} from '@angular/core';
import {ActiveFeatureSet} from '../../core/services/config/active-feature-set';
import {UiFeature} from '../../core/services/config/profiles/ui-feature';

/**
 * Easily check for active features in angular templates.
 */
@Pipe({name: 'isActiveFeature'})
export class IsActiveFeaturePipe implements PipeTransform {
  constructor(private activeFeatureSet: ActiveFeatureSet) {}

  transform(feature: UiFeature): boolean {
    return this.activeFeatureSet.has(feature);
  }
}
