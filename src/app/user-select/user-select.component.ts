import { fromEvent } from 'rxjs';
import { tap, debounceTime, distinctUntilChanged, startWith, delay } from 'rxjs/operators';

import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { EnvAppService } from '../svc/env-app.service';
import { UsersService } from '../svc/users.service';
import { UserDataSource } from '../svc/user.ds';
import { User } from '../model/user';

@Component({
  selector: 'app-user-select',
  templateUrl: './user-select.component.html',
  styleUrls: ['./user-select.component.css']
})
export class UserSelectComponent implements OnInit, AfterViewInit {
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('filter') filter: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @Output() selected = new EventEmitter<User>();

    values: UserDataSource;
    displayedColumns: string[] = ['name', 'login'];

    constructor(
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
      // listen when user is logged on
      this.env.logged.subscribe(value => {
        this.load();
      });
    }

    load(): void {
      const ofs = this.paginator.pageIndex * this.paginator.pageSize;
      this.values.load(
        this.env.user.login, this.env.user.password,
        this.filter.nativeElement.value, ofs, this.paginator.pageSize);

      this.values.connect(null).subscribe(
          value => {
            if (value) {
              this.paginator.length = value.length;
            }
        });

      const f = new User({name: this.filter.nativeElement.value});
      /*
      this.service.count(this.env.user, f).subscribe(
        value => {
          if (value) {
            this.paginator.length = value;
          }
        });
      */
    }

    onSelect(value: object): void {
      this.selected.emit(new User(value));
    }
  }
