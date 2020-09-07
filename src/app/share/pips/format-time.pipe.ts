import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {

  transform(time: number): string {
    if (time) {
      // tslint:disable-next-line:no-bitwise
      const temp = time | 0;
      // tslint:disable-next-line:no-bitwise
      const minute = (time / 60 | 0).toString().padStart(2, '0');
      // tslint:disable-next-line:no-bitwise
      const second = (time % 60 | 0).toString().padStart(2, '0');
      return `${minute}:${second}`;
    } else {
      return '00:00';
    }
  }

}
