import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { KrIconComponent } from '@shared/components/kr-icon/kr-icon.component';
import { KrSpinnerComponent } from '@shared/components/kr-spinner/kr-spinner.component';
import {
  selectUserProfile,
  selectUserLoading,
} from '@store/user/user.selectors';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink, KrIconComponent, AsyncPipe, KrSpinnerComponent],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  profile$ = this.store.select(selectUserProfile);
  userLoading$ = this.store.select(selectUserLoading);

  constructor(private store: Store) {}
}
