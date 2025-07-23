import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: object[],searchTxt:string,filterBy:object , ...args: unknown[]): unknown {
    return null;
  }

}
