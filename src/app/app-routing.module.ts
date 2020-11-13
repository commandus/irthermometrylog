import { AboutComponent } from './about/about.component';
import { MeasurementIndoorComponent } from './measurement-indoor/measurement-indoor.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MeasurementListComponent } from './measurement-list/measurement-list.component';

const routes: Routes = [
  { path: '', component: MeasurementListComponent},
  { path: 'card/:cardno', component: MeasurementListComponent},
  { path: 'indoor', component: MeasurementIndoorComponent},
  { path: 'about', component: AboutComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
