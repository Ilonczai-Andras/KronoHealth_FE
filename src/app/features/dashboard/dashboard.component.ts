import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AppState } from '@app/store';
import * as UserActions from '@app/store/user/user.actions';
import { selectUsers, selectLoading, selectError } from '@app/store/user/user.selectors';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  users$: Observable<any[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private store: Store<AppState>) {
    this.users$ = this.store.select(selectUsers);
    this.loading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);
  }

  ngOnInit(): void {
    this.store.dispatch(UserActions.loadUsers());
  }

  loadUsers(): void {
    this.store.dispatch(UserActions.loadUsers());
  }
}
