export class Measurement {
  public id: number;
  public gateid: number;
  public imei: string;
  public time: number;
  public t: number;
  public tir: number;
  public tmin: number;
  public tambient: number;
  public userid: number;

  private reset(): void {
    this.id = 0;
    this.gateid = 0;
    this.imei = '';
    this.time = 0;
    this.t = 0;
    this.tir = 0;
    this.tmin = 0;
    this.tambient = 0;
    this.userid = 0;
  }

  constructor(value: object = {}) {
    this.reset();
    if (typeof value !== 'undefined') {
      this.assign(value);
    }
  }

  assign(value: object): any {
    if (typeof value !== 'undefined') {
      Object.assign(this, value);
    }
  }
}
