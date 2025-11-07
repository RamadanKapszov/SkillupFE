import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LessonDetailsComponent } from './lesson-details/lesson-details.component';
import { SafeUrlPipe } from 'src/app/shared/pipes/safe-url.pipe';
import { SharedModule } from 'src/app/shared/shared.module';
import { LessonsRoutingModule } from './lessons-routing.module';

@NgModule({
  declarations: [LessonDetailsComponent, SafeUrlPipe],
  imports: [CommonModule, RouterModule, SharedModule, LessonsRoutingModule],
})
export class LessonsModule {}
