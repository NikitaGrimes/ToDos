import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'boolCompleted',
  standalone: true
})
export class BoolCompletedPipe implements PipeTransform {

  transform(value: boolean): string {
    if (value) return 'completed';
    return 'in progress';
  }
}
