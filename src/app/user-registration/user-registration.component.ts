import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { User } from '../model/user';
import { EnvAppService } from '../svc/env-app.service';
import { LoginService } from '../svc/login.service';

// not complete
// https://stackoverflow.com/questions/51605737/confirm-password-validation-in-angular-6
//
@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {
  @Output() registered = new EventEmitter<boolean>();
  public formGroup: FormGroup;
  public progress = false;
  message = 'Регистрация нового аккаунта';
  success: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private env: EnvAppService,
    private loginService: LoginService
  ) {
    this.success = env.hasAccount();
    this.initForm();
  }

  ngOnInit(): void {
  }

  checkPasswords(group: FormGroup): any {
    const pass = group.get('password').value;
    const confirmPass = group.get('password2').value;
    return pass === confirmPass ? null : { passwordsNotEqual: true };
  }

  private initForm(): void {
    this.formGroup = this.formBuilder.group({
      login: ['', [ Validators.required,
        Validators.pattern('^[a-zA-Z][a-zA-Z0-9-.]*$') ]
      ],
      password: ['', [ Validators.required ]
      ],
      password2: ['', [ Validators.required ]
      ]
    }, { validator: this.checkPasswords });
   }

  register(): void {
    this.progress = true;
    const user = new User(this.formGroup.getRawValue());

    delete user.id;
    delete user.rights;
    delete user.name;

    this.loginService.register(user).subscribe(
      value => {
        this.progress = false;
        if (value) {
          this.success = true;
          this.message = 'Успешная регистрация';
          this.env.user = new User(value);
          localStorage.setItem('user', JSON.stringify(this.env.user));
          this.registered.emit(true);
        } else {
          // TODO show error
          this.success = false;
          this.env.user.logout();
          this.message = 'Неуспешная регистрация, повторите';
          this.env.onError('Registration error');
          this.registered.emit(false);
        }
      },
      error => {
        this.progress = false;
        this.success = false;
        this.message = 'Неуспешная регистрация, повторите позже';
        this.env.user.logout();
        this.env.onError(error);
        this.registered.emit(false);
      });
  }

}
