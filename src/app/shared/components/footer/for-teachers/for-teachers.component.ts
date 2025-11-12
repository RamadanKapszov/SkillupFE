import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-for-teachers',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './for-teachers.component.html',
  styleUrls: ['../info-page.component.scss'],
})
export class ForTeachersComponent {
  // Future idea: Fetch teacher program details dynamically from the API
}
