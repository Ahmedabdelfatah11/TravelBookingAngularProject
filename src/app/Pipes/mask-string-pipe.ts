import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskStringPipe'
})
export class MaskStringPipe implements PipeTransform {

  transform(value: string): string {
    if (!value || value.length <= 4) {
      return value; // لو النص قصير مش هنخفي حاجة
    }

    const firstTwo = value.substring(0, 2);
    const lastTwo = value.substring(value.length - 2);
    const middle = '*'.repeat(value.length - 4);

    return firstTwo + middle + lastTwo;

  }
}
