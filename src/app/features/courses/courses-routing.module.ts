import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoursesListComponent } from './pages/courses-list/courses-list.component';
import { CourseDetailsComponent } from './pages/courses-details/course-details.component';
import { LessonDetailsComponent } from './pages/lesson-details/lesson-details.component';

const routes: Routes = [
  { path: 'lesson/:id', component: LessonDetailsComponent }, // 👈 първи!
  { path: ':id', component: CourseDetailsComponent },
  { path: '', component: CoursesListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoursesRoutingModule {}
