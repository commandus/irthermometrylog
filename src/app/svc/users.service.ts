import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  url = 'https://aikutsk.ru/irtm/users';
  constructor(private httpClient: HttpClient) { }

  // user: User, filter: User, ofs: number, count: number
  list(): Observable<any> {
    return this.httpClient.get(this.url);
  }
}
