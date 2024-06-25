import {Pipe, PipeTransform} from '@angular/core';

/**
 * Creates Compare By Function for Angular Material compareWith parameters
 */
@Pipe({name: 'compareByField'})
export class CompareByFieldPipe implements PipeTransform {
  transform(key: string): (a: any, b: any) => boolean {
    return (a, b) =>
      a === b ||
      (typeof a === 'object' && typeof b === 'object' && a[key] === b[key]);
  }
}
