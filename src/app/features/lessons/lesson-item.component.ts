import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LessonProgressDto } from 'src/app/core/services/progress.service';

@Component({
  selector: 'app-lesson-item',
  templateUrl: './lesson-item.component.html',
  styleUrls: ['./lesson-item.component.scss'],
})
export class LessonItemComponent {
  @Input() lesson!: LessonProgressDto;
  @Output() completed = new EventEmitter<string>();

  markComplete() {
    if (this.lesson.isCompleted) return;
    this.completed.emit(this.lesson.lessonId);
  }
}
