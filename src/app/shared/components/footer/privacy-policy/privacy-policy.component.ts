import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['../info-page.component.scss'],
})
export class PrivacyPolicyComponent {
  // Future: You can pull privacy content from the backend for versioning
}
