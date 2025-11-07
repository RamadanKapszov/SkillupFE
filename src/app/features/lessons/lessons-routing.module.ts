import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LessonDetailsComponent } from './lesson-details/lesson-details.component';

const routes: Routes = [{ path: ':id', component: LessonDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LessonsRoutingModule {}
