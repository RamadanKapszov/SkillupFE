import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoursesListComponent } from './courses-list/courses-list.component';
import { CourseDetailsComponent } from './courses-details/courses-details.component';

const routes: Routes = [
  { path: '', component: CoursesListComponent },
  { path: ':id', component: CourseDetailsComponent } // /courses/:id
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule {}
