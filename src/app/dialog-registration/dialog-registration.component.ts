import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-user-registration',
  templateUrl: './dialog-registration.component.html',
  styleUrls: ['./dialog-registration.component.css']
})
export class DialogRegistrationComponent  {
  @Output() registered = new EventEmitter<boolean>();

  title: string;
  message: string;

  constructor(
    private dialogRef: MatDialogRef<DialogRegistrationComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.title = data.title;
    this.message = data.message;
  }

  onRegistered(value: boolean) {
    if (value) {
      this.dialogRef.close({yes: true});
      this.registered.emit(true);
    }
  }

}
