export class User {
  public id: number;
  public start: number;
  public status: number;
  public rights: number;
  public name: string;
  public login: string;
  public password: string;
  public tag: number;

  private reset(): void {
    this.id = 0;
    this.start = 0;
    this.status = 0;
    this.rights = 0;
    this.name = '';
    this.login = '';
    this.password = '';
    this.tag = 0;
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

  public logout(): void {
    this.reset();
    localStorage.removeItem('watcher');
  }

}
