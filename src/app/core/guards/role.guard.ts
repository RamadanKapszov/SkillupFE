import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const allowed: string[] = route.data?.['roles'] ?? [];
    if (allowed.length === 0) return true; // няма ограничения

    const user = this.auth.currentUser;
    if (user && allowed.includes(user.role)) return true;

    // без достъп -> пренасочи към курсове
    return this.router.parseUrl('/courses');
  }
}
