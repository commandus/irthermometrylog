import { CollectionViewer, DataSource} from '@angular/cdk/collections';
import { BehaviorSubject, of } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { Measurement } from './../model/measurement';
import { MeasurementsService } from './measurements.service';

/**
 * @see https://blog.angular-university.io/angular-material-data-table/
 * @see https://github.com/angular-university/angular-material-course/tree/2-data-table-finished
 */
export class MeasurementsDataSource implements DataSource<Measurement> {
  private subject = new BehaviorSubject<Measurement[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading = this.loadingSubject.asObservable();

  constructor(private service: MeasurementsService) { }

  connect(collectionViewer: CollectionViewer): Observable<Measurement[]> {
    return this.subject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
      this.subject.complete();
      this.loadingSubject.complete();
  }

  load(login: string, password: string, filter: string, offset: number, pagesize: number, sort: string
  ): void {
    this.loadingSubject.next(true);
    this.service.list(login, password, filter, offset, pagesize, sort).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
    .subscribe(
      {
        next: (value: any) => {
          if (!value.length) {
            // console.log('Dataset empty');
          }
          this.subject.next(value);
        },
        error: (e: any) => {
          console.error('Dataset measurements error');
          console.error(e);
        }}
      );
  }
}
