import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { TestPageComponent } from './features/tests/test-page/test-page.component';
import { HomeComponent } from './features/home/home.component';
import { HowItWorksComponent } from './shared/components/footer/how-it-works/how-it-works.component';
import { ForTeachersComponent } from './shared/components/footer/for-teachers/for-teachers.component';
import { PrivacyPolicyComponent } from './shared/components/footer/privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './shared/components/footer/terms-of-service/terms-of-service.component';
import { TeacherGuard } from './core/guards/teacher.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },

  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile-page.component').then(
        (m) => m.ProfilePageComponent
      ),
  },

  {
    path: 'courses',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/courses/courses.module').then((m) => m.CoursesModule),
  },
  {
    path: 'lessons',
    loadChildren: () =>
      import('./features/lessons/lessons.module').then((m) => m.LessonsModule),
  },
  { path: 'tests/course/:courseId', component: TestPageComponent },
  { path: 'how-it-works', component: HowItWorksComponent },
  { path: 'for-teachers', component: ForTeachersComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms-of-service', component: TermsOfServiceComponent },

  {
    path: 'about',
    loadChildren: () =>
      import('./features/about/about.module').then((m) => m.AboutModule),
  },
  {
    path: 'categories',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/categories/categories.module').then(
        (m) => m.CategoriesModule
      ),
  },
  {
    path: 'teacher',
    canActivate: [TeacherGuard],
    loadChildren: () =>
      import('./features/teacher/teacher.module').then((m) => m.TeacherModule),
  },

  // Пример за Admin зона (ако имаш такъв модул):
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] },
    loadChildren: () =>
      import('./features/admin/admin.module').then((m) => m.AdminModule),
  },

  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
