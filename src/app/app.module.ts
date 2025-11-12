import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NavbarComponent } from './core/navbar/navbar.component';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor'; // adjust path
import { ToastContainerComponent } from './shared/components/toast-container/toast-container.component';
import { TestsModule } from './features/tests/tests.module';
import { HomeComponent } from './features/home/home.component';
import { SharedModule } from './shared/shared.module';
import { FooterComponent } from './shared/components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ToastContainerComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TestsModule,
    SharedModule,
    FooterComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
