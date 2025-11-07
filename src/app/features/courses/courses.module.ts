import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CourseDetailsComponent } from './pages/courses-details/course-details.component';
import { LessonItemComponent } from '../lessons/lesson-item.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoursesListComponent } from './pages/courses-list/courses-list.component';
import { SafeUrlPipe } from 'src/app/shared/pipes/safe-url.pipe';

const routes: Routes = [
  { path: '', component: CoursesListComponent },
  { path: ':id', component: CourseDetailsComponent },
];

@NgModule({
  declarations: [
    CoursesListComponent,
    CourseDetailsComponent,
    LessonItemComponent,
    SafeUrlPipe,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
})
export class CoursesModule {}
