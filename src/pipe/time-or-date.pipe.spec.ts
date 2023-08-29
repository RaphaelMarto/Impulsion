import { TimeOrDatePipe } from './time-or-date.pipe';

describe('TimeOrDatePipe', () => {
  it('create an instance', () => {
    const pipe = new TimeOrDatePipe();
    expect(pipe).toBeTruthy();
  });
});
