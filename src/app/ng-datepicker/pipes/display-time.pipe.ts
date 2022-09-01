import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayTime'
})
export class DisplayTimePipe implements PipeTransform {
  transform(value: number): unknown {
    return value <= 0 || value <= 9 ? `0${value}` : `${value}`;
  }
}
