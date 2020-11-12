import { StartFinish } from './../model/startfinish';
import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-date-select',
  templateUrl: './dialog-date-select.component.html',
  styleUrls: ['./dialog-date-select.component.css']
})
export class DialogDateSelectComponent {
  @Output() selected = new EventEmitter<StartFinish>();
  title: string;
  message: string;
  value: StartFinish;

  constructor(
    private dialogRef: MatDialogRef<DialogDateSelectComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.title = data.title;
    this.message = data.message;

    if (typeof data.value === 'undefined') {
      this.value = new StartFinish(Math.round(new Date().getTime() / 1000), Math.round(new Date().getTime() / 1000));
    } else {
      this.value = data.value;
    }
  }

  onSelected(v: StartFinish): void {
    if (v) {
      this.selected.emit(v);
      this.dialogRef.close({yes: true});
    }
  }
}
