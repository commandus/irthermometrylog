export class Settings {

  public isNameVisible: boolean;

  private reset(): void {
    this.isNameVisible = true;
  }

  constructor(values: object = {}) {
    this.reset();
    if (typeof values !== 'undefined') {
      Object.assign(this, values);
    }
  }

  public save(): void {
    localStorage.setItem('settings', JSON.stringify(this));
  }
}
