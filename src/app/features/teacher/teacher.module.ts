import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TeacherRoutingModule } from './teacher-routing.module';

import { TeacherLayoutComponent } from './layout/teacher-layout.component';
import { TeacherDashboardComponent } from './pages/dashboard/teacher-dashboard.component';
import { TeacherCoursesComponent } from './pages/courses/teacher-courses.component';

@NgModule({
  declarations: [
    TeacherLayoutComponent,
    TeacherDashboardComponent,
    TeacherCoursesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TeacherRoutingModule,
  ],
})
export class TeacherModule {}
