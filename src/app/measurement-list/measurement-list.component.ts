import { UsersService } from './../svc/users.service';
import { StartFinish } from './../model/startfinish';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { fromEvent } from 'rxjs';
import { tap, debounceTime, distinctUntilChanged, startWith, delay } from 'rxjs/operators';
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { EnvAppService } from '../svc/env-app.service';
import { MeasurementsService } from './../svc/measurements.service';
import { MeasurementsDataSource } from '../svc/measurements.ds';
import { Measurement } from '../model/measurement';
import { DialogDateSelectComponent } from '../dialog-date-select/dialog-date-select.component';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';

declare var google;

@Component({
  selector: 'app-measurement-list',
  templateUrl: './measurement-list.component.html',
  styleUrls: ['./measurement-list.component.css']
})
export class MeasurementListComponent implements OnInit, AfterViewInit {
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('filter') filter: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    public max10 = 3700;
    public cardno: number;
    public startFinish = new StartFinish();
    public tmin: number;
    public tmax: number;
    public errorCode = 0;

    public values: MeasurementsDataSource;
    private userNames = new Object();  // pseudo-associative array
    public displayedColumns: string[] = ['time', 't', 'card', 'cn'];

    constructor(
      private dialog: MatDialog,
      private router: Router,
      private route: ActivatedRoute,
      public env: EnvAppService,
      private service: MeasurementsService,
      private serviceUsers: UsersService
    ) { }

    ngOnInit(): void {
      this.values = new MeasurementsDataSource(this.service);
      this.route.params.subscribe(params => {
        this.cardno = params['cardno'];
      });
      this.values.connect(null).subscribe(r => {
        if (!this.hasError(r)) {
          this.updateMinMax();
          this.drawChart(this);
        }
     });
    }

    hasError(r: object): boolean {
      if (typeof r['status'] !== 'undefined') {
        if (r['status'] === 'Error') {
          this.onError(-1);
          return true;
        }
      }
      this.errorCode = 0;
      return false;
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
      ).subscribe();

      this.env.logged.subscribe(value => {
        this.load();
      });
    }

    loadMeasurements(): void {
      const f = new Measurement({name: this.filter.nativeElement.value});
      let filt = '"time">=' + this.startFinish.start * 1000 + ' and "time"<=' + (this.startFinish.finish  * 1000 + 999);
      if (typeof this.cardno !== 'undefined') {
        filt += ' and userid = ' + this.cardno;
      }

      const sort = '';
      const ofs = this.paginator.pageIndex * this.paginator.pageSize;
      this.values.load(
        this.env.user.login, this.env.user.password,
        filt, ofs, this.paginator.pageSize, sort);

      this.service.count(this.env.user.login, this.env.user.password, filt).subscribe({
        next: (value: any) => {
          if (value) {
            this.paginator.length = value;
          }
        },
        error: (e: any) => {
          this.paginator.length = 0;
        }}
      );
    }

    load(): void {
      if (!this.env.isNameVisible()) {
        this.loadMeasurements();
        return;
      }
      this.serviceUsers.list().subscribe(value => {
        const sz = value.length;
        if (sz) {
          for (let i = 0; i < sz; i++) {
            this.userNames[value[i].card] = value[i].name;
          }
        }
        this.loadMeasurements();
      });
    }

    getName(card: number): string {
      // if (typeof this.userNames === 'undefined') return '';
      let v = this.userNames[card];
      if (typeof v === 'undefined') {
        v = 'Неизвестный';
      }
      return v;
    }

    showDate(value: any): void {
      this.startFinish = value;
      this.load();
    }

    selectDate(): void {
      const d = new MatDialogConfig();
      d.autoFocus = true;
      d.data = {
        title: 'Выберите дату',
        message: 'для просмотра',
        value: this.startFinish
      };
      const dialogRef = this.dialog.open(DialogDateSelectComponent, d);
      const sub = dialogRef.componentInstance.selected.subscribe((value) => {
        this.showDate(value);
      });
    }

    selectAllCards(): void {
      this.router.navigateByUrl('/');
    }

    /**
     * Calc and show min & max temperature
     */
    updateMinMax(): void {
      this.values.connect(null).forEach(r => {
        let tmin = 99999;
        let tmax = -27315;
        try {
          r.forEach(l => {
            if (l.t < tmin) {
              tmin = l.t;
            }
            if (l.t > tmax) {
              tmax = l.t;
            }
        }
        );
        } catch (error) {
        }

        if (tmin !== 99999) {
          this.tmin = tmin;
        } else {
          this.tmin = 0;
        }
        if (tmax !== -27315) {
          this.tmax = tmax;
        } else {
          this.tmax = 0;
        }
      });
    }

    onError(code: number): void {
      this.errorCode = code;
      console.error('Error ' + code);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        title: 'Требуется авторизация пользователя',
        message: 'Нажмите "Да" для входа по логину и паролю сотрудника',
      };
      const dialogRef = this.dialog.open(DialogConfirmComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(
          data => {
            if (data.yes) {
              const YSN_LOGIN_URL = 'https://adfs.ysn.ru/adfs/oauth2/authorize?client_id=d7096849-369b-4b74-81e1-1a41c59ede5d&response_type=id_token+token&redirect_uri=https%3A%2F%2Faikutsk.ru%2Flogin_ysn&scope=openid'
                + '&nonce=https%3A%2F%2Faikutsk.ru%2Firtm%2F%23%2F'
                + '&cancel_uri=https%3A%2F%2Faikutsk.ru%2Firtm%2F%23%2Ferror';
              window.location.href = YSN_LOGIN_URL;
            } else {
              this.router.navigateByUrl('error?code=-2');
            }
          }
      );
    }

    drawChart(that: MeasurementListComponent): void {
      let data: any;
      if (typeof google.visualization === 'undefined' || typeof google.visualization.DataTable === 'undefined') {
        google.charts.setOnLoadCallback(() => {
          that.drawChart(that);
        });
        return;
      }
      try {
          data = new google.visualization.DataTable();
      } catch (error) {
        console.error(error);
        google.charts.setOnLoadCallback(() => {
          that.drawChart(that);
        });
        return;
      }
      data.addColumn('date', 'Время');
      data.addColumn('number', 'Помещение');
      data.addColumn('number', 'Объект(ы)');

      that.values.connect(null).forEach(r => {
        if (Array.isArray(r)) {
          r.forEach(l => {
            let d = new Date(l.time);
            if (isNaN(d.getTime())) {
              d = new Date(parseInt(l.time + '', 10));
            }
            data.addRow([
              d,
              l.tmin > -8000 ? l.tmin / 100. : 0.0,
              l.t / 100.
            ]);
          });
        }
     });

      const options = {
        title: 'Температура, C',
        curveType: 'none',
        legend: { position: 'bottom' }
      };

      const chart = new google.visualization.LineChart(document.getElementById('measurement-list-chart'));
      chart.draw(data, options);
    }
  }
