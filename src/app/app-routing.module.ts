import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' }, // 👈 начална страница
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'courses',
    loadChildren: () =>
      import('./features/courses/courses.module').then(m => m.CoursesModule),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./features/profile/profile.module').then(m => m.ProfileModule),
  },
  { path: '**', redirectTo: 'auth/login' }, // fallback
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
