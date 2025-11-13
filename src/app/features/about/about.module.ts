import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { AboutRoutingModule } from './about-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AboutPageComponent],
  imports: [CommonModule, AboutRoutingModule, ReactiveFormsModule],
})
export class AboutModule {}
