import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timestampToTimeInterval',
})
export class TimestampToTimeIntervalPipe implements PipeTransform {
  transform(timestamp: string): string {
    if (!timestamp) return '';

    const dateNow = new Date();
    const dateReceived = new Date(timestamp);

    const differenceMs = dateNow.getTime() - dateReceived.getTime();
    const differenceSec = Math.floor(differenceMs / 1000);
    const differenceMin = Math.floor(differenceSec / 60);
    const differenceHours = Math.floor(differenceMin / 60);
    const differenceDays = Math.floor(differenceHours / 24);
    const differenceMonths = Math.floor(differenceDays / 30);
    const differenceYears = Math.floor(differenceDays / 365);

    if (differenceSec < 60) return 'just now';
    if (differenceMin < 60) return `${differenceMin} minute${differenceMin === 1 ? '' : 's'}`;
    if (differenceHours < 24) return `${differenceHours} hour${differenceHours === 1 ? '' : 's'}`;
    if (differenceDays < 30) return `${differenceDays} day${differenceDays === 1 ? '' : 's'}`;
    if (differenceMonths < 12) return `${differenceMonths} month${differenceMonths === 1 ? '' : 's'}`;

    return `${differenceYears} year${differenceYears === 1 ? '' : 's'}`;
  }
}
