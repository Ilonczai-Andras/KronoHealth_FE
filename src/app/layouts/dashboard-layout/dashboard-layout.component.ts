import { Component, OnInit, OnDestroy, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { KrToastComponent } from '@shared/components/kr-toast/kr-toast.component';
import { AnalysisEventsService } from '@core/services/analysis-events.service';
import { selectToken } from '../../store/auth/auth.selectors';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, KrToastComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss'],
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly sseService = inject(AnalysisEventsService);

  ngOnInit(): void {
    const storedToken = localStorage.getItem('kh_token');
    if (storedToken && !this.sseService.isConnected) {
      this.sseService.connect(storedToken);
    }
  }

  ngOnDestroy(): void {
  }

  @HostListener('document:visibilitychange')
  onVisibilityChange(): void {
    if (!document.hidden) {
      this.store
        .select(selectToken)
        .pipe(take(1))
        .subscribe((token) => {
          if (token) {
            this.sseService.reconnectIfNeeded();
          }
        });
    }
  }
}
