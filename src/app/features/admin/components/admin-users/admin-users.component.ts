import { Component, OnInit } from '@angular/core';
import { AdminUsersService } from './admin-users.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  filtered: any[] = [];
  q = '';
  selectedUser: any = null;
  showEditModal = false;
  showRoleModal = false;
  showDeleteModal = false;

  constructor(
    private adminUsers: AdminUsersService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.adminUsers.getAll().subscribe({
      next: (users) => {
        this.users = users;
        this.filtered = [...users];
      },
    });
  }

  filter() {
    const t = this.q.toLowerCase();
    this.filtered = this.users.filter(
      (u) =>
        u.username.toLowerCase().includes(t) ||
        u.email.toLowerCase().includes(t)
    );
  }

  edit(user: any) {
    this.selectedUser = { ...user };
    this.showEditModal = true;
  }

  saveEdit() {
    this.adminUsers
      .updateProfile(this.selectedUser.id, this.selectedUser)
      .subscribe({
        next: () => {
          this.toast.success('User updated');
          this.showEditModal = false;
          this.load();
        },
      });
  }

  changeRole(user: any) {
    this.selectedUser = user;
    this.showRoleModal = true;
  }

  saveRole() {
    this.adminUsers
      .updateRole(this.selectedUser.id, this.selectedUser.role)
      .subscribe({
        next: () => {
          this.toast.success('Role updated');
          this.showRoleModal = false;
          this.load();
        },
      });
  }

  askDelete(user: any) {
    this.selectedUser = user;
    this.showDeleteModal = true;
  }

  deleteUser() {
    this.adminUsers.delete(this.selectedUser.id).subscribe({
      next: () => {
        this.toast.success('User deleted');
        this.showDeleteModal = false;
        this.load();
      },
    });
  }
}
