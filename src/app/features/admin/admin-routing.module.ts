import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminCoursesComponent } from './components/admin-courses/admin-courses.component';
import { AdminCategoriesComponent } from './components/admin-categories/admin-categories.component';
import { AdminLessonsComponent } from './components/admin-lessons/admin-lessons.component';
import { AdminBadgesComponent } from './admin-badges/admin-badges.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'courses', component: AdminCoursesComponent },
      { path: 'categories', component: AdminCategoriesComponent },
      { path: 'lessons', component: AdminLessonsComponent },
      { path: 'badges', component: AdminBadgesComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
