import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { RuDateAdapter } from './rudateadapter';
import { MatPaginatorIntlRu } from './mat-paginator-ru';

import { ControlPanelComponent } from './control-panel/control-panel.component';
import { UserSelectComponent } from './user-select/user-select.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UsersService } from './svc/users.service';
import { LoginService } from './svc/login.service';
import { DateSelectComponent } from './date-select/date-select.component';
import { MeasurementsService } from './svc/measurements.service';
import { DialogUserSelectComponent } from './dialog-user-select/dialog-user-select.component';
import { DialogDatesSelectComponent } from './dialog-dates-select/dialog-dates-select.component';
import { DialogConfirmComponent } from './dialog-confirm/dialog-confirm.component';
import { DialogRegistrationComponent } from './dialog-registration/dialog-registration.component';
import { DialogLoginComponent } from './dialog-login/dialog-login.component';

import { DatesSelectComponent } from './dates-select/dates-select.component';
import { DialogDateSelectComponent } from './dialog-date-select/dialog-date-select.component';
import { MeasurementIndoorComponent } from './measurement-indoor/measurement-indoor.component';
import { MeasurementListComponent } from './measurement-list/measurement-list.component';
import { AboutComponent } from './about/about.component';
import { ErrorComponent } from './error/error.component';
import { HelpAboutComponent } from './help-about/help-about.component';

@NgModule({
  declarations: [
    AppComponent,

    ControlPanelComponent,
    DateSelectComponent,
    UserLoginComponent,
    UserRegistrationComponent,
    UserSelectComponent,

    DialogLoginComponent,
    DialogRegistrationComponent,
    DialogConfirmComponent,
    DialogUserSelectComponent,
    DialogDatesSelectComponent,
    DatesSelectComponent,
    DialogDateSelectComponent,

    MeasurementListComponent,
    MeasurementIndoorComponent,
    AboutComponent,
    ErrorComponent,
    HelpAboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule, ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatMenuModule,
    MatSortModule, MatPaginatorModule, MatProgressBarModule,
    MatInputModule, MatFormFieldModule, MatTableModule,
    MatDialogModule, MatSlideToggleModule, MatListModule,
    MatTooltipModule, MatDatepickerModule, MatNativeDateModule,
    FlexLayoutModule
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'ru-RU'
    },
    {
      provide: DateAdapter,
      useClass: RuDateAdapter
    },
    {
      provide: MatPaginatorIntl,
      useClass: MatPaginatorIntlRu
    },
    MeasurementsService,
    LoginService,
    UsersService
  ],
  entryComponents: [
    DialogConfirmComponent,
    DialogLoginComponent,
    DialogRegistrationComponent,
    DialogUserSelectComponent,
    DialogDateSelectComponent,
    DialogDatesSelectComponent
  ],

})
export class AppModule { }
