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

    private path: string;
    public cardno: number;
    public startFinish = new StartFinish();

    public values: MeasurementsDataSource;
      // 'id', 'gateid', 'imei', 'time', 't', 'tir', 'tmin', 'tambient', 'userid'
      public displayedColumns: string[] = [
        'time', 't', 'userid'
    ];

    constructor(
      private dialog: MatDialog,
      private router: Router,
      private route: ActivatedRoute,
      public env: EnvAppService,
      private service: MeasurementsService
    ) { }

    ngOnInit(): void {
      this.values = new MeasurementsDataSource(this.service);
      this.route.params.subscribe(params => {
        this.cardno = params['cardno'];
        console.log('=========== url ');
        if (this.route.url['value'].length) {
          this.path = this.route.url['value'][0].path;
        } else {
          this.path = '';
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
        // console.log(value);
        this.load();
      });
    }

    load(): void {
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
      this.drawChart();
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
