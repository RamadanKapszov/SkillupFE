import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean | UrlTree {
    const raw = localStorage.getItem('skillup.user');
    const user = raw ? JSON.parse(raw) : null;

    const isAdmin =
      user &&
      (user.role === 'Admin' || user.role === 'admin' || user.Role === 'Admin');

    if (!isAdmin) {
      return this.router.parseUrl('/home');
    }

    return true;
  }
}
