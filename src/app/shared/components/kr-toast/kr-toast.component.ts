import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastService, ToastMessage } from '@shared/services/toast.service';
import { KrIconComponent } from '@shared/components/kr-icon/kr-icon.component';

@Component({
  selector: 'kr-toast',
  standalone: true,
  imports: [CommonModule, KrIconComponent],
  templateUrl: './kr-toast.component.html',
  styleUrls: ['./kr-toast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KrToastComponent implements OnInit, OnDestroy {
  private readonly toastService = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);
  private sub!: Subscription;

  toasts: ToastMessage[] = [];
  private timers = new Map<string, ReturnType<typeof setTimeout>>();

  ngOnInit(): void {
    this.sub = this.toastService.toasts$.subscribe((toasts) => {
      const incoming = toasts.filter(
        (t) => !this.timers.has(t.id),
      );
      this.toasts = toasts;
      this.cdr.markForCheck();

      incoming.forEach((t) => {
        const timer = setTimeout(() => this.dismiss(t.id), t.duration);
        this.timers.set(t.id, timer);
      });
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.timers.forEach((t) => clearTimeout(t));
  }

  dismiss(id: string): void {
    clearTimeout(this.timers.get(id));
    this.timers.delete(id);
    this.toastService.dismiss(id);
  }

  iconFor(type: ToastMessage['type']): string {
    return type === 'success'
      ? 'check-circle'
      : type === 'error'
        ? 'alert-circle'
        : 'info';
  }
}
