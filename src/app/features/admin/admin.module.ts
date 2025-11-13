// src/app/features/admin/admin.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminCoursesComponent } from './components/admin-courses/admin-courses.component';
import { AdminCategoriesComponent } from './components/admin-categories/admin-categories.component';
import { AdminLessonsComponent } from './components/admin-lessons/admin-lessons.component';
import { AdminBadgesComponent } from './admin-badges/admin-badges.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    AdminDashboardComponent,
    AdminUsersComponent,
    AdminCoursesComponent,
    AdminCategoriesComponent,
    AdminLessonsComponent,
    AdminBadgesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AdminRoutingModule,
    ReactiveFormsModule,
  ],
})
export class AdminModule {}
