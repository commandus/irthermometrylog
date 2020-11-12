import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../model/user';

@Component({
  selector: 'app-dialog-user-select',
  templateUrl: './dialog-user-select.component.html',
  styleUrls: ['./dialog-user-select.component.css']
})
export class DialogUserSelectComponent {
  @Output() selected = new EventEmitter<User>();
  title: string;
  message: string;

  constructor(
    private dialogRef: MatDialogRef<DialogUserSelectComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.title = data.title;
    this.message = data.message;
  }

  onSelected(value: User) {
    if (value) {
      this.selected.emit(value);
      this.dialogRef.close({yes: true});
    }
  }
}
