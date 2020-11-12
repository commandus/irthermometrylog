import { EnvAppService } from './env-app.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Measurement } from './../model/measurement';

/**
 * Service return temperature measurements
 * [{id:0, gateid:0, imei: "",time: 0, t:0, tir:0, tmin:0, tambient:0, userid:0}, ...
 * svc  service URL, e.g. https:://acme.org/json
 * Params:
 * - login
 * - password
 *
 * Method GET
 *
 * List params:
 *  f - filter, e.g. "userid = 123456 AND time < 123 AND time > 12"
 *  sort - sort clause, e.g. "time desc"
 *  o - offset (default 0)
 *  s - page size (default 100)
 *
 * Return array of Measurement
 *
 * &c=count - count number
 * &id=number - return one measurement by identifier (no array!)
 *
 * Method POST - add Measurement object (read from body)
 * Method DELETE - delete by id
 *
 */
@Injectable({
  providedIn: 'root'
})
export class MeasurementsService {
  private url: string;

  constructor(
    private httpClient: HttpClient,
    private env: EnvAppService)
  {
    this.url = this.env.svc + '/get';
  }

  list(login: string, password: string, filter: string, ofs: number, pagesize: number, sort: string): Observable<any> {
    return this.httpClient.get(this.url
      + '?login=' + login + '&password=' + password
      + '&f=' + filter + '&o=' + ofs + '&s=' + pagesize + '&sort=' + sort)
    .pipe(
      map((response: Measurement) => {
        console.log(response);
        return response;
    }));
  }

  count(login: string, password: string, filter: string): Observable<number> {
    return this.httpClient.get(this.url
      + '?login=' + login + '&password=' + password
      + '&f=' + filter + '&c=count')
    .pipe(
      map((response: number) => {
        return response;
    }));
  }

  get(login: string, password: string, code: number): Observable<any> {
    return this.httpClient.get(this.url + '?id=' + code
      + '&login=' + login + '&password=' + password)
    .pipe(
      map((response: Measurement) => {
        return response;
    }));
  }

  add(login: string, password: string, value: Measurement): Observable<any> {
    return this.httpClient.post(this.url
      + '?login=' + login + '&password=' + password, value);
  }

  rm(login: string, password: string, id: number): Observable<any> {
    return this.httpClient.delete(this.url
      + '?login=' + login + '&password=' + password + '&id=' + id);
  }

  /*
  rmUser(login: string, password: string, userid: number, deviceid: number): Observable<any> {
    return this.httpClient.delete(this.url
      + '?login=' + login + '&password=' + password + '&userid=' + userid + '&deviceid=' + deviceid);
  }

  addUser(login: string, password: string, userid: number, deviceid: number): Observable<any> {
    return this.httpClient.put(this.url
      + '?login=' + login + '&password=' + password + '&userid=' + userid + '&deviceid=' + deviceid, '');
  }

  update(login: string, password: string, value: Measurement): Observable<any> {
    return this.httpClient.put(this.url
      + '?login=' + login + '&password=' + password, value);
  }
  */
}
