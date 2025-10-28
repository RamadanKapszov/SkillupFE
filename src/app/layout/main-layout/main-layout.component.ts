import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  isAdmin = false;

  constructor(private authService: AuthService) {
    this.isAdmin = this.authService.getCurrentUser()?.role === 'Admin';
  }

  logout() {
    this.authService.logout();
  }
}
