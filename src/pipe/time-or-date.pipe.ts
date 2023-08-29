import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'timeOrDate'
})
export class TimeOrDatePipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(timestamp: number): string {
    const now = new Date().getTime();
    const timestampMillis = timestamp * 1000;
    const timeDifference = now - timestampMillis;
    
    if (timeDifference < 24 * 60 * 60 * 1000) {
      // Within the last 24 hours, show the time
      return this.datePipe.transform(timestampMillis, 'HH:mm') ?? '';
    } else {
      // Older than 24 hours, show day and month
      return this.datePipe.transform(timestampMillis, 'dd MMM') ?? '';
    }
  }
}