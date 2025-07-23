import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'descriptionLimit'
})
export class DescriptionLimitPipe implements PipeTransform {

  transform(description: string, ...args: unknown[]): string {
    return description.slice(0, 30) + (description.length > 30 ? '...' : '');
  }

}
