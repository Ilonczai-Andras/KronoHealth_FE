# KronoHealth Frontend - Sprint 1 Summary

**Date**: March 6, 2026  
**Framework**: Angular 18 Standalone  
**State Management**: NgRx 17  
**Icon System**: lucide-angular (custom KrIconComponent wrapper)  
**Status**:  Sprint 1 Complete  Zero build errors

---

##  Sprint Goal

> Egy reszponzív Web App váz, ahol az összes főoldal elérhető, működik a navigáció, és készen állnak a komponensek az API-kapcsolatra.

---

##  What Was Built

### Design System
- **Glassmorphism CSS**  full custom design system in `styles.scss`
  - CSS custom properties: `--bg-primary`, `--accent-cyan: #00d4ff`, `--accent-purple: #7b2ff7`, `--accent-green: #00ff88`
  - Reusable utility classes: `.glass-card`, `.glass-panel`, `.btn`, `.btn-primary`, `.btn-ghost`, `.badge-*`
  - Inter font (300800) via Google Fonts
  - Sidebar (`--sidebar-width: 260px`) and topbar (`--topbar-height: 64px`) layout variables

### Layout Architecture
- **PublicLayout** (`/`)  header + `<router-outlet>` for unauthenticated pages
- **DashboardLayout** (`/app`)  protected layout with collapsible Sidebar + Topbar + main content area
  - `SidebarComponent`  brand logo, nav items with active state, user section, logout
  - `TopbarComponent`  search field, notification bell, user chip

### Routing (`app.routes.ts`)
```
/               PublicLayout
  (index)       LandingComponent
  login         LoginComponent
  register      RegisterComponent

/app            DashboardLayout  [canActivate: authGuard]
  dashboard     DashboardComponent
  biomarker-lab BiomarkerLabComponent
  integrations  IntegrationsComponent

**              redirect to /
```
All routes use `loadComponent` lazy loading.

### Auth Guard
- `src/app/core/guards/auth.guard.ts`  `CanActivateFn`, checks `localStorage.getItem('kh_token')`, redirects to `/login`
- TODO: replace with NgRx auth state selector in Sprint 2

### Feature Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Hero section, features grid, how-it-works steps, CTA |
| Login | `/login` | Reactive form, email + password validation, show/hide password |
| Register | `/register` | 5-field form, cross-field password match validator, terms checkbox |
| Dashboard | `/app/dashboard` | 6 metric cards, weekly bar chart, HRV trend, sleep quality chart |
| Biomarker Lab | `/app/biomarker-lab` | PDF drag-drop upload zone, 12 blood markers table, report history |
| Integrations | `/app/integrations` | 8 device cards (Garmin, Oura, Apple Health, etc.), category filter |

### Icon System  `KrIconComponent`
- **Problem**: `lucide-angular` v0.577.0 was compiled with Angular 13 (`minVersion: "12.0.0"`), causing AOT incompatibility errors in Angular 18 strict template type checking.
- **Solution**: Created a standalone `KrIconComponent` (`src/app/shared/components/kr-icon/kr-icon.component.ts`) that imports only raw icon data arrays from `lucide-angular` (plain JS, no Angular metadata) and renders SVGs imperatively via `Renderer2`.
- **Usage**: `<app-icon name="activity" [size]="20" color="#00d4ff"></app-icon>`
- **Icons**: 35+ supported  activity, moon, heart, zap, trending-up/down, arrow-right, mail, lock, eye, eye-off, user, bell, search, layout-dashboard, flask-conical, plug, settings, log-out, upload, file-text, link, link-2-off, refresh-cw, check-circle, alert-triangle, watch, flame, droplets, microscope, shield, check, chevron-down/right

### State Management (NgRx  ready for wiring)
- Store configured with DevTools integration
- `user` feature slice (actions, reducer, effects, selectors) as the established pattern
- All components have TODO comments marking where NgRx dispatch/select calls will go

---

##  Project Structure

```
src/app/
 app.routes.ts                         # Full nested lazy routing
 core/
    guards/
       auth.guard.ts                 # NEW: localStorage auth guard
    http/
        api.service.ts                # Generic CRUD service
 layouts/
    public-layout/                    # NEW
       public-layout.component.*
    dashboard-layout/                 # NEW
        dashboard-layout.component.*
        components/
            sidebar/                  # NEW
            topbar/                   # NEW
 features/
    landing/                          # NEW
    auth/
       login/                        # NEW
       register/                     # NEW
    dashboard/                        # REWRITTEN
    biomarker-lab/                    # NEW
    integrations/                     # NEW
 shared/
     components/
         kr-icon/                      # NEW: custom icon component
             kr-icon.component.ts
```

---

##  Build Output

```
Initial chunk files    590 kB  (main + styles + polyfills + runtime)
Lazy chunk files       ~110 kB total across 10 route chunks
Build time             ~60s
Errors                 0
Warnings               0
```

---

##  Quick Start Commands

```bash
npm install          # Install dependencies
npm start            # Dev server  http://localhost:4200
npm run build        # Production build
npm test             # Unit tests (Karma + Jasmine)
```

---

##  Sprint 2  Next Steps

- Wire `LoginComponent`  NgRx `authActions.login`  Effects  JWT storage
- Replace `localStorage` auth guard with NgRx auth state selector
- Connect `DashboardComponent` metric cards to real API via `ApiService`
- Add HTTP interceptor for `Authorization: Bearer <token>` header
- Implement file upload in `BiomarkerLabComponent` (multipart/form-data)
- Add OAuth2 flow for Garmin / Oura / Apple Health in `IntegrationsComponent`
