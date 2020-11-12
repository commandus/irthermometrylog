import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  url = 'https://aikutsk.ru/irtm/json/user';
  constructor(private httpClient: HttpClient) { }

  list(user: User, v: User, ofs: number, count: number): Observable<any> {
    return this.httpClient.post(this.url, { cmd: 'ls', value: v, u: user, o: ofs, c: count });
  }

  count(user: User, v: User): Observable<any> {
    return this.httpClient.post(this.url, { cmd: 'count', value: v, u: user });
  }

  get(user: User, uid: number): Observable<any> {
    return this.httpClient.post(this.url, { cmd: 'get', u: user, id: uid });
  }

  update(user: User, v: User): Observable<any> {
    return this.httpClient.post(this.url, { cmd: 'put', u: user, value: v } );
  }

  add(user: User, v: User): Observable<any> {
    return this.httpClient.post(this.url, { cmd: 'put', u: user, value: v } );
  }

  rm(user: User, v: User): Observable<any> {
    return this.httpClient.post(this.url, { cmd: 'rm', value: v, u: user });
  }

}
