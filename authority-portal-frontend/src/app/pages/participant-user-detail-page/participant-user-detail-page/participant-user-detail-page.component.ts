import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {
  DEFAULT_PARTICIPANT_USER_DETAIL_PAGE_STATE,
  ParticipantUserDetailPageState,
} from 'src/app/pages/participant-user-detail-page/state/participant-user-detail-page-state';
import {ParticipantUserDetailPageStateImpl} from 'src/app/pages/participant-user-detail-page/state/participant-user-detail-page-state-impl';
import {
  RefreshOrganizationUser,
  SetOrganizationUserId,
} from 'src/app/pages/participant-user-detail-page/state/particpant-user-detail-page-actions';

@Component({
  selector: 'app-participant-user-detail-page',
  templateUrl: './participant-user-detail-page.component.html',
})
export class ParticipantUserDetailPageComponent implements OnInit {
  state = DEFAULT_PARTICIPANT_USER_DETAIL_PAGE_STATE;
  ngOnDestroy$ = new Subject();

  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.setOrganizationUserId(params.get('mdsId')!!, params.get('userId')!!);
      this.refresh();
    });
    this.startListeningToState();
  }

  startListeningToState() {
    this.store
      .select<ParticipantUserDetailPageState>(
        ParticipantUserDetailPageStateImpl,
      )
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
      });
  }

  setOrganizationUserId(mdsId: string, userId: string) {
    this.store.dispatch(new SetOrganizationUserId(mdsId, userId));
  }

  refresh() {
    this.store.dispatch(RefreshOrganizationUser);
  }

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
