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

    drawChart(): void {
      const data = new google.visualization.DataTable();
      data.addColumn('date', 'Время');
      data.addColumn('number', 'Помещение');
      data.addColumn('number', 'Объект(ы)');

      this.values.connect(null).forEach(r => {
        r.forEach(l => {
          data.addRow([
            new Date(l.time),
            l.tmin / 100.,
            l.t / 100.
          ]);
        });
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
