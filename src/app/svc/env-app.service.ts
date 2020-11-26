import { DialogLoginComponent } from './../dialog-login/dialog-login.component';
import { DialogRegistrationComponent } from './../dialog-registration/dialog-registration.component';
import { Injectable } from '@angular/core';
import { Settings } from './../model/settings';
import { User } from './../model/user';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EnvAppService {
  settings: Settings;
  version = '1.01';
  user = new User();
  svc = 'https://aikutsk.ru/irtm';
  svcTest = 'https://aikutsk.ru/irtm';

  private loggedSource = new Subject<boolean>();
  logged = this.loggedSource.asObservable();

  public hasAccount(): boolean {
    return this.user.login.length !== 0;
  }

  public isAdmin(): boolean {
    return this.hasAccount() && ((this.user.rights & 1) !== 0);
  }

  login(): void {
    const d = new MatDialogConfig();
    d.autoFocus = true;
    d.data = {
      value: this.user
    };
    const dialogRef = this.dialog.open(DialogLoginComponent, d);
    const sub = dialogRef.componentInstance.logged.subscribe((value) => {
      this.loggedSource.next(value);
    });
  }

  register(): void {
    const d = new MatDialogConfig();
    d.autoFocus = true;
    d.data = {
      value: this.user
    };
    const dialogRef = this.dialog.open(DialogRegistrationComponent, d);
    const sub = dialogRef.componentInstance.registered.subscribe((value) => {
      this.loggedSource.next(value);
    });
  }

  constructor(
    private dialog: MatDialog
  ) {
    this.settings = new Settings(JSON.parse(localStorage.getItem('settings')));
    this.user = new User(JSON.parse(localStorage.getItem('user')));
  }

  public onError(error: any): void {
    console.log(error);
  }

}
