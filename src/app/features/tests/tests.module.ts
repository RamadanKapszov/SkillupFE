import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TestPageComponent } from './test-page/test-page.component';

@NgModule({
  declarations: [TestPageComponent],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class TestsModule {}
