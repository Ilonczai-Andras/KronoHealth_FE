# Sprint 1 Setup Guide - Angular 18 with NgRx & PrimeNG

## Welcome to KronoHealth Frontend

This is a comprehensive Sprint 1 setup for the KronoHealth Frontend application using Angular 18 with state management via NgRx and UI components from PrimeNG.

---

## ✅ What's Been Set Up

### 1. **Angular 18 Project Structure**
- Standalone components (Angular 18 best practice)
- Modular folder structure (Core, Features, Shared)
- Path aliases for clean imports
- SCSS support for styling

### 2. **NgRx State Management**
- Store configuration with Redux DevTools
- Example user feature store with:
  - **Actions**: Application events
  - **Reducer**: State updates
  - **Effects**: API side effects
  - **Selectors**: Optimized state queries
- Ready-to-use pattern for new features

### 3. **API Integration**
- Generic `ApiService` in `src/app/core/http/`
- HTTP client pre-configured
- Environment-based API URL configuration
- Error handling and logging

### 4. **PrimeNG UI Library**
- Lara Light Blue theme pre-configured
- Global styling setup
- Ready to use 80+ components
- Prime Icons integration

### 5. **Development Tools**
- Angular CLI 18
- TypeScript 5.4
- Jasmine/Karma for unit testing
- Hot module reloading

---

## 🚀 First Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```
Visit: `http://localhost:4200`

### 3. View the Example Dashboard
- Navigate to the dashboard component
- Try the "Load Users" button (currently mocked)
- Monitor state changes in Redux DevTools

---

## 📁 Directory Structure Guide

```
src/
├── app/
│   ├── core/                           # Core module
│   │   ├── http/
│   │   │   └── api.service.ts         # ⭐ API client
│   │   └── services/                  # Business logic services
│   │
│   ├── features/                       # Feature modules
│   │   └── dashboard/
│   │       ├── dashboard.component.ts
│   │       ├── dashboard.component.html
│   │       └── dashboard.component.scss
│   │
│   ├── shared/                         # Shared components & utilities
│   │   ├── components/
│   │   ├── directives/
│   │   ├── pipes/
│   │   └── models/
│   │
│   ├── store/                          # ⭐ NgRx State Management
│   │   ├── index.ts                   # Root store config
│   │   └── user/                      # Example feature store
│   │       ├── user.actions.ts        # 📝 Define actions
│   │       ├── user.reducer.ts        # 🔄 State updates
│   │       ├── user.effects.ts        # 🌐 API calls
│   │       └── user.selectors.ts      # 📊 State queries
│   │
│   ├── app.component.*                 # Root component
│   └── app.routes.ts                   # Routing config
│
├── environments/                       # Config per environment
│   ├── environment.ts                 # Development
│   └── environment.prod.ts            # Production
│
├── styles.scss                         # Global styles
└── index.html                          # Entry HTML
```

---

## 💡 Common Tasks

### Create a New Feature Component

1. **Create component folder**:
   ```bash
   mkdir -p src/app/features/my-feature
   ```

2. **Create component file**:
   ```typescript
   // src/app/features/my-feature/my-feature.component.ts
   import { Component } from '@angular/core';
   import { CommonModule } from '@angular/common';
   import { ButtonModule } from 'primeng/button';
   
   @Component({
     selector: 'app-my-feature',
     standalone: true,
     imports: [CommonModule, ButtonModule],
     template: `
       <p-button label="Click Me" (onClick)="onClick()"></p-button>
     `
   })
   export class MyFeatureComponent {
     onClick() {
       console.log('Button clicked!');
     }
   }
   ```

3. **Add route in `app.routes.ts`**:
   ```typescript
   {
     path: 'my-feature',
     loadComponent: () => import('./features/my-feature/my-feature.component')
       .then(m => m.MyFeatureComponent)
   }
   ```

### Add State Management for a Feature

1. **Create actions** (`src/app/store/my-feature/my-feature.actions.ts`):
   ```typescript
   import { createAction, props } from '@ngrx/store';
   
   export const loadMyFeature = createAction('[My Feature] Load');
   export const loadMyFeatureSuccess = createAction(
     '[My Feature API] Success',
     props<{ data: any[] }>()
   );
   ```

2. **Create reducer** (`src/app/store/my-feature/my-feature.reducer.ts`):
   ```typescript
   import { createReducer, on } from '@ngrx/store';
   import * as MyFeatureActions from './my-feature.actions';
   
   export interface MyFeatureState {
     data: any[];
     loading: boolean;
   }
   
   export const initialState: MyFeatureState = {
     data: [],
     loading: false
   };
   
   export const myFeatureReducer = createReducer(
     initialState,
     on(MyFeatureActions.loadMyFeature, (state) => ({
       ...state,
       loading: true
     })),
     on(MyFeatureActions.loadMyFeatureSuccess, (state, { data }) => ({
       ...state,
       data,
       loading: false
     }))
   );
   ```

3. **Create effects** (`src/app/store/my-feature/my-feature.effects.ts`):
   ```typescript
   import { Injectable } from '@angular/core';
   import { Actions, createEffect, ofType } from '@ngrx/effects';
   import { switchMap, map } from 'rxjs/operators';
   import * as MyFeatureActions from './my-feature.actions';
   import { ApiService } from '@core/http/api.service';
   
   @Injectable()
   export class MyFeatureEffects {
     loadMyFeature$ = createEffect(() =>
       this.actions$.pipe(
         ofType(MyFeatureActions.loadMyFeature),
         switchMap(() =>
           this.api.get('endpoint').pipe(
             map((data) => MyFeatureActions.loadMyFeatureSuccess({ data }))
           )
         )
       )
     );
   
     constructor(
       private actions$: Actions,
       private api: ApiService
     ) {}
   }
   ```

4. **Register in store** (`src/app/store/index.ts`):
   ```typescript
   import { ActionReducerMap } from '@ngrx/store';
   import { myFeatureReducer, MyFeatureState } from './my-feature/my-feature.reducer';
   
   export interface AppState {
     myFeature: MyFeatureState;
   }
   
   export const appStore: ActionReducerMap<AppState> = {
     myFeature: myFeatureReducer
   };
   ```

### Use State in Component

```typescript
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '@app/store';
import * as MyFeatureActions from '@app/store/my-feature/my-feature.actions';
import { selectMyFeatureData } from '@app/store/my-feature/my-feature.selectors';

@Component({
  selector: 'app-my-component',
  standalone: true,
  template: `
    <div *ngIf="(data$ | async) as data">
      {{ data | json }}
    </div>
  `
})
export class MyComponent implements OnInit {
  data$: Observable<any[]>;

  constructor(private store: Store<AppState>) {
    this.data$ = this.store.select(selectMyFeatureData);
  }

  ngOnInit() {
    this.store.dispatch(MyFeatureActions.loadMyFeature());
  }
}
```

### Make an API Call

```typescript
import { Component } from '@angular/core';
import { ApiService } from '@core/http/api.service';

@Component({
  selector: 'app-my-component',
  standalone: true,
  template: `<div>{{ result | json }}</div>`
})
export class MyComponent {
  result: any;

  constructor(private api: ApiService) {}

  loadData() {
    // GET request
    this.api.get('users').subscribe(
      (data) => this.result = data,
      (error) => console.error(error)
    );

    // POST request
    this.api.post('users', { name: 'John' }).subscribe(
      (data) => this.result = data
    );
  }
}
```

### Use PrimeNG Components

```typescript
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [ButtonModule, CardModule],
  template: `
    <p-card>
      <p-button label="Click Me" (click)="onClick()"></p-button>
    </p-card>
  `
})
export class ExampleComponent {
  onClick() {
    console.log('Button clicked!');
  }
}
```

Available PrimeNG components: [Browse All](https://primeng.org/components)

---

## 🔧 Configuration

### Update API Endpoints

Edit `src/environments/environment.ts` (development) or `environment.prod.ts` (production):

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://your-api-url/api',
  apiVersion: 'v1'
};
```

### Update PrimeNG Theme

In `angular.json`, edit the `styles` array:

```json
{
  "styles": [
    "src/styles.scss",
    "node_modules/primeng/resources/themes/YOUR-THEME/theme.css",
    "node_modules/primeng/resources/primeng.min.css",
    "node_modules/primeicons/primeicons.css"
  ]
}
```

Available themes: `lara-light-blue`, `lara-dark-blue`, `md-light-indigo`, etc.

---

## 🧪 Testing

### Run Unit Tests
```bash
npm test
```

### Example Test
```typescript
import { TestBed } from '@angular/core/testing';
import { MyComponent } from './my.component';

describe('MyComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(MyComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
```

---

## 🐛 Debugging

### Redux DevTools
1. Install [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools-extension)
2. Open DevTools (F12)
3. Navigate to "Redux" tab
4. See all state changes in real-time

### Console Logging
```typescript
// Log state
this.store.select(selectMyData).subscribe(data => {
  console.log('Current state:', data);
});
```

### VS Code Debugging
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "ng serve",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:4200",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

---

## 📚 Useful Resources

- [Angular Docs](https://angular.io)
- [NgRx Guide](https://ngrx.io)
- [PrimeNG Components](https://primeng.org)
- [RxJS Operators](https://rxjs.dev/guide/operators)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## ❓ Troubleshooting

**Port 4200 already in use?**
```bash
ng serve --port 4300
```

**Dependencies not installing?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Store not working?**
- Check Redux DevTools Extension is installed
- Verify actions are dispatched with `console.log()` in effects
- Ensure reducers are registered in `store/index.ts`

**PrimeNG components not showing?**
- Import the component module (e.g., `ButtonModule`)
- Verify theme CSS is loaded in `angular.json`
- Check browser console for errors

---

**Happy coding! 🚀**