export class User {
  public card: number;
  public name: string;
  // reserved
  public id: number;
  public rights: number;
  public login: string;
  public password: string;

  private reset(): void {
    this.card = 0;
    this.name = '';
    this.id = 0;
    this.rights = 0;
    this.login = '';
    this.password = '';
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
