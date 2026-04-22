import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastAction {
  label: string;
  callback: () => void;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  action?: ToastAction;
  duration: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts = new BehaviorSubject<ToastMessage[]>([]);
  readonly toasts$ = this._toasts.asObservable();

  show(
    message: string,
    type: ToastMessage['type'] = 'info',
    action?: ToastAction,
    duration = 5000,
  ): void {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const toast: ToastMessage = { id, type, message, action, duration };
    this._toasts.next([...this._toasts.value, toast]);
  }

  dismiss(id: string): void {
    this._toasts.next(this._toasts.value.filter((t) => t.id !== id));
  }
}
