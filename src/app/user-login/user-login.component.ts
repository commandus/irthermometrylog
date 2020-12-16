import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { User } from './../model/user';
import { EnvAppService } from '../svc/env-app.service';
import { LoginService } from './../svc/login.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  @Output() logged = new EventEmitter<boolean>();
  public formGroup: FormGroup;
  public progress = false;
  message = 'Вход в аккаунт';
  success: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private env: EnvAppService,
    private loginService: LoginService
  ) {
  }

  ngOnInit(): void {
    this.success = this.env.hasAccount();
    this.initForm();
  }

  private initForm(): void {
    this.formGroup = this.formBuilder.group({
      login: [this.env.user.login,
        [ Validators.required ]
      ],
      password: [this.env.user.password,
        [ Validators.required ]
      ]
    });
   }

  login(): void {
    this.progress = true;
    const user = new User(this.formGroup.getRawValue());

    delete user.id;
    delete user.rights;
    delete user.name;

    this.loginService.login(user).subscribe(
      value => {
        this.progress = false;
        if (value) {
          this.success = true;
          this.message = 'Успешный вход';
          this.env.user = new User(value);
          localStorage.setItem('user', JSON.stringify(this.env.user));
          this.logged.emit(true);
        } else {
          // TODO show error
          this.success = false;
          this.env.user.logout();
          this.message = 'Неуспешный вход, повторите';
          this.logged.emit(false);
        }
      },
      error => {
        this.progress = false;
        this.success = false;
        this.message = 'Неуспешный вход, повторите позже';
        this.env.user.logout();
        this.env.onError(error);
        this.logged.emit(false);
      });
  }

  signup(): void {
    this.env.register();
  }
}
