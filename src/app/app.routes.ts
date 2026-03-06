import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const appRoutes: Routes = [
  // ── Public routes (with public layout) ────────────────────────────────────
  {
    path: '',
    loadComponent: () => import('./layouts/public-layout/public-layout.component').then(m => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent),
        title: 'KronoHealth – Longevity Intelligence'
      },
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
        title: 'Belépés – KronoHealth'
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
        title: 'Regisztráció – KronoHealth'
      }
    ]
  },

  // ── Protected routes (with dashboard layout) ──────────────────────────────
  {
    path: 'app',
    loadComponent: () => import('./layouts/dashboard-layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Dashboard – KronoHealth'
      },
      {
        path: 'biomarker-lab',
        loadComponent: () => import('./features/biomarker-lab/biomarker-lab.component').then(m => m.BiomarkerLabComponent),
        title: 'Biomarker Lab – KronoHealth'
      },
      {
        path: 'integrations',
        loadComponent: () => import('./features/integrations/integrations.component').then(m => m.IntegrationsComponent),
        title: 'Integrációk – KronoHealth'
      }
    ]
  },

  // ── Fallback ──────────────────────────────────────────────────────────────
  { path: '**', redirectTo: '' }
];

