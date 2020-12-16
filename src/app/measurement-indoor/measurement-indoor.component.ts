import { StartFinish } from './../model/startfinish';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { tap, startWith, delay } from 'rxjs/operators';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { EnvAppService } from '../svc/env-app.service';
import { MeasurementsService } from './../svc/measurements.service';
import { MeasurementsDataSource } from '../svc/measurements.ds';
import { DialogDateSelectComponent } from '../dialog-date-select/dialog-date-select.component';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';

declare var google;

@Component({
  selector: 'app-measurement-indoor',
  templateUrl: './measurement-indoor.component.html',
  styleUrls: ['./measurement-indoor.component.css']
})
export class MeasurementIndoorComponent implements OnInit, AfterViewInit {
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    public startFinish = new StartFinish();
    public errorCode = 0;
    public values: MeasurementsDataSource;
      // 'id', 'gateid', 'imei', 'time', 't', 'tir', 'tmin', 'tambient', 'userid'
      public displayedColumns: string[] = [
        'time', 'tmin'
    ];

    constructor(
      private dialog: MatDialog,
      private router: Router,
      public env: EnvAppService,
      private service: MeasurementsService
    ) { }

    ngOnInit(): void {
      this.values = new MeasurementsDataSource(this.service);
      this.values.connect(null).subscribe(r => {
        if (!this.hasError(r)) {
          this.drawChart(this);
        }
      });
    }

    ngAfterViewInit(): void {
      this.paginator.page
        .pipe(
          startWith(null),
          delay(0),
          tap(() => this.load())
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
      const filt = '"time">=' + this.startFinish.start * 1000 + ' and "time"<=' + (this.startFinish.finish  * 1000 + 999);

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
                + '&nonce=https%3A%2F%2Faikutsk.ru%2Firtm%2Findoor%2F%23%2F'
                + '&cancel_uri=https%3A%2F%2Faikutsk.ru%2Firtm%2F%23%2Ferror';
              window.location.href = YSN_LOGIN_URL;
            } else {
              this.router.navigateByUrl('error?code=-2');
            }
          }
      );
    }

    drawChart(that: MeasurementIndoorComponent): void {
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

      that.values.connect(null).forEach(r => {
        if (Array.isArray(r)) {
          r.forEach(l => {
            let d = new Date(l.time);
            if (isNaN(d.getTime())) {
              d = new Date(parseInt(l.time + '', 10));
            }
            data.addRow([
              d,
              l.tmin / 100.
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
