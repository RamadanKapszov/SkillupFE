import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';

@NgModule({
  declarations: [LoadingSpinnerComponent, EmptyStateComponent],
  imports: [CommonModule],
  exports: [CommonModule, LoadingSpinnerComponent, EmptyStateComponent],
})
export class SharedModule {}
