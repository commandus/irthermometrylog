import { fromEvent } from 'rxjs';
import { tap, debounceTime, distinctUntilChanged, startWith, delay } from 'rxjs/operators';
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { EnvAppService } from '../svc/env-app.service';
import { UsersService } from '../svc/users.service';
import { UserDataSource } from '../svc/user.ds';
import { User } from '../model/user';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, AfterViewInit {
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('filter') filter: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    public values: UserDataSource;
    public displayedColumns: string[] = [
      'id', 'name', 'login', 'password', 'start', 'status', 'rights' ];

    constructor(
      private router: Router,
      public env: EnvAppService,
      private service: UsersService
    ) { }

    ngOnInit(): void {
      this.values = new UserDataSource(this.service);
    }

    ngAfterViewInit(): void {
      this.paginator.page
        .pipe(
          startWith(null),
          delay(0),
          tap(() => this.load())
          )
        .subscribe();

      fromEvent(this.filter.nativeElement, 'keyup')
      .pipe(
          debounceTime(2000),
          distinctUntilChanged(),
          tap(() => {
            this.paginator.pageIndex = 0;
            this.load();
          })
      )
      .subscribe();

      this.sort.sortChange
      .pipe(
        tap(() => {
          this.load();
        })
      )
      .subscribe();
      // listen when watcher is logged on
      this.env.logged.subscribe(value => {
        // console.log(value);
        this.load();
      });
    }

    load(): void {
      const ofs = this.paginator.pageIndex * this.paginator.pageSize;
      this.values.load(
        this.env.user.login, this.env.user.password,
        this.filter.nativeElement.value, ofs, this.paginator.pageSize);
      const f = new User({name: this.filter.nativeElement.value});
      this.service.count(this.env.user, f).subscribe(
        value => {
          if (value) {
            this.paginator.length = value;
          }
        });
    }

    isRoot(value: User): boolean {
      // bitwise operations forbidden in Typescipt and Javascriot
      // return (value.rights & 1) !== 0;
      return value.rights === 1;
    }

    isUserDisabled(value: User): boolean {
      return value.status !== 0;
    }

    toogleRoot(v: User): void {
      if (this.isRoot(v)) {
        v.rights = 4;
      } else {
        v.rights = 1;
      }
    }

    toogleUserStatus(v: User): void {
      if (this.isUserDisabled(v)) {
        v.status = 0;
      } else {
        v.status = 1;
      }
    }

    addNew(): void {
      this.router.navigateByUrl('/user');
    }
  }
