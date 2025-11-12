import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherLayoutComponent } from './layout/teacher-layout.component';
import { TeacherDashboardComponent } from './pages/dashboard/teacher-dashboard.component';
import { TeacherCoursesComponent } from './pages/courses/teacher-courses.component';

const routes: Routes = [
  {
    path: '',
    component: TeacherLayoutComponent,
    children: [
      { path: '', component: TeacherDashboardComponent },
      { path: 'courses', component: TeacherCoursesComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeacherRoutingModule {}
