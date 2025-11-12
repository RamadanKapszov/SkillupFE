import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './terms-of-service.component.html',
  styleUrls: ['../info-page.component.scss'],
})
export class TermsOfServiceComponent {
  // Future: You could integrate acceptance tracking for users here
}
