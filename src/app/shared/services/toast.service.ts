import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();
  private counter = 0;

  show(message: string, type: Toast['type'] = 'info', duration = 3500) {
    const toast: Toast = { id: ++this.counter, message, type };
    const current = this.toastsSubject.value;
    this.toastsSubject.next([...current, toast]);

    setTimeout(() => this.remove(toast.id), duration);
  }

  success(msg: string) {
    this.show(msg, 'success');
  }
  error(msg: string) {
    this.show(msg, 'error');
  }
  info(msg: string) {
    this.show(msg, 'info');
  }
  warning(msg: string) {
    this.show(msg, 'warning');
  }

  remove(id: number) {
    const current = this.toastsSubject.value.filter((t) => t.id !== id);
    this.toastsSubject.next(current);
  }
}
