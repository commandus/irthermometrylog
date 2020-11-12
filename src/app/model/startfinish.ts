export class StartFinish {
  start: number;
  finish: number;

  constructor(start?: number, finish?: number) {
    if (typeof start === 'undefined') {
      this.setToday();
    } else {
      this.start = start;
      this.finish = finish;
    }
  }

  public setToday(): void {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    this.start = Math.round(d.getTime() / 1000);
    this.finish = this.start + 86400;
  }
}
