import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {filter} from 'rxjs/operators';
import {showDialogUntil} from '../../../../core/utils/mat-dialog-utils';
import {UserDeleteDialogComponent} from './user-delete-dialog.component';
import {UserDeleteDialog} from './user-delete-dialog.model';

@Injectable()
export class UserDeleteDialogService {
  constructor(private matDialog: MatDialog) {}

  showDeleteUserModal(
    data: UserDeleteDialog,
    until$: Observable<any>,
  ): Observable<true> {
    return showDialogUntil<UserDeleteDialog, boolean>(
      this.matDialog,
      UserDeleteDialogComponent,
      {data, panelClass: 'w-[30rem]'},
      until$,
    ).pipe(filter((it) => !!it)) as Observable<true>;
  }
}
