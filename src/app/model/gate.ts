import { Measurement } from './measurement';

export class Gate {
  public id: number;
  public secret: number;
  public name: string;
  public color: string;
  public imei: string;
  public tag: number;
  public measurements?: Measurement[];

  private reset() {
    this.id = 0;
    this.secret = 0;
    this.name = '';
    this.color = '#9400d3';
    this.imei = '';
    this.tag = 0;
  }

  constructor(value: object = {}) {
    this.reset();
    if (typeof value !== 'undefined') {
      this.assign(value);
    }
    if (typeof this.color === 'undefined') {
      this.color = '#9400d3';
    }
  }

  assign(value: object): any {
    if (typeof value !== 'undefined') {
      Object.assign(this, value);
    }
  }
}
