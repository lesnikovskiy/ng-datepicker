import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bsngDisplayTime'
})
export class DisplayTimePipe implements PipeTransform {
  transform(value: number): string {
    const val = value < 0 ? 0 : value;
    return val <= 9 ? `0${val}` : `${val}`;
  }
}
