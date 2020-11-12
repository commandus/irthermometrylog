import { UsersService } from './users.service';
import { CollectionViewer, DataSource} from '@angular/cdk/collections';
import { BehaviorSubject, of } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { User } from '../model/user';

/**
 * @see https://blog.angular-university.io/angular-material-data-table/
 * @see https://github.com/angular-university/angular-material-course/tree/2-data-table-finished
 */
export class UserDataSource implements DataSource<User> {
  private subject = new BehaviorSubject<User[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading = this.loadingSubject.asObservable();

  constructor(private service: UsersService) { }

  connect(collectionViewer: CollectionViewer): Observable<User[]> {
    return this.subject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
      this.subject.complete();
      this.loadingSubject.complete();
  }

  load(alogin: string, apassword: string, filter: string, offset: number, pagesize: number): void {
    this.loadingSubject.next(true);
    const w = new User({login: alogin, password: apassword });
    const v = new User({name: filter});
    this.service.list(w, v, offset, pagesize).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
    .subscribe(
      value => {
        this.subject.next(value);
      }
      );
  }
}
