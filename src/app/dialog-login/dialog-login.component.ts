import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-user-login',
  templateUrl: './dialog-login.component.html',
  styleUrls: ['./dialog-login.component.css']
})
export class DialogLoginComponent implements OnInit {
  @Output() logged = new EventEmitter<boolean>();

  title: string;
  message: string;

  constructor(
    private dialogRef: MatDialogRef<DialogLoginComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.title = data.title;
    this.message = data.message;
  }

  ngOnInit() {
  }

  onLogged(value: boolean) {
    if (value) {
      this.dialogRef.close({yes: true});
      this.logged.emit(true);
    }
  }

}
