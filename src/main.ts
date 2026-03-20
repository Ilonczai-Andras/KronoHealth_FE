import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { appStore } from './app/store';
import { AuthEffects } from './app/store/auth/auth.effects';
import { UserEffects } from './app/store/user/user.effects';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';
import { environment } from './environments/environment';

const providers = [
  provideAnimations(),
  provideHttpClient(withInterceptors([authInterceptor])),
  provideRouter(appRoutes),
  provideStore(appStore),
  provideEffects(AuthEffects, UserEffects),
  provideStoreDevtools({
    maxAge: 25,
    logOnly: environment.production,
  }),
];

bootstrapApplication(AppComponent, {
  providers: providers,
}).catch((err) => console.error(err));
