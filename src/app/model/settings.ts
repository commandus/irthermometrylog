export class Settings {

  private reset() {
  }

  constructor(values: object = {}) {
    this.reset();
    if (typeof values !== 'undefined') {
      Object.assign(this, values);
    }
  }

  public save() {
    localStorage.setItem('settings', JSON.stringify(this));
  }
}
