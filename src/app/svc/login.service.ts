import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '.././model/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  url = 'https://aikutsk.ru/irtm/json/login';

  constructor(private httpClient: HttpClient) { }

  login(value: User): Observable<any> {
    return this.httpClient.post(this.url, value);
  }

  register(value: User): Observable<any> {
    return this.httpClient.put(this.url, value);
  }
}
