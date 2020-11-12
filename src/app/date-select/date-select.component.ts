import { StartFinish } from './../model/startfinish';
import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-date-select',
  templateUrl: './date-select.component.html',
  styleUrls: ['./date-select.component.css']
})
export class DateSelectComponent implements OnInit {
  @Output() selected = new EventEmitter<StartFinish>();
  @Input() start: number;
  @Input() finish: number;

  startDate: FormControl;

  constructor(
  ) {
  }

  ngOnInit(): void {
    this.startDate = new FormControl(typeof this.start === 'undefined' ? new Date() : new Date(this.start * 1000));
    }

  select(): void {
    this.startDate.value.setHours(0, 0, 0, 0);
    const start = Math.round(this.startDate.value.getTime() / 1000);
    let r: StartFinish;
    const finish = start + 86400; // day inclusive
    r = new StartFinish(start, finish);
    this.selected.emit(r);
  }
}
