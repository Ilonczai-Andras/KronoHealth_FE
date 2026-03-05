# KronoHealth Frontend - Sprint 1 Setup (Angular 18)

## Project Overview

This is the KronoHealth Frontend application built with modern Angular 18 technologies:

- **Framework**: Angular 18 (Standalone Components)
- **State Management**: NgRx 17
- **UI Library**: PrimeNG 17
- **HTTP Client**: Angular HTTP Client
- **Language**: TypeScript 5.4
- **Styling**: SCSS

## Technology Stack

### Core Dependencies
- `@angular/*`: ^18.0.0 - Angular core framework
- `@ngrx/*`: ^17.0.0 - State management (Store, Effects, Router Store, Store DevTools)
- `primeng`: ^17.0.0 - UI component library
- `primeicons`: ^6.0.0 - Icon library
- `rxjs`: ^7.8.0 - Reactive programming library

### Development Dependencies
- `@angular/cli`: ^18.0.0 - Angular CLI
- `typescript`: ~5.4.0 - TypeScript compiler
- Testing frameworks (Jasmine, Karma)

## Project Structure

```
src/
├── app/
│   ├── core/          # Core services and HTTP client
│   │   ├── http/      # API service
│   │   └── services/  # Business logic services
│   ├── features/      # Feature modules (e.g., dashboard)
│   ├── shared/        # Shared components and utilities
│   ├── store/         # NgRx state management
│   │   └── user/      # Example user state (actions, reducer, effects, selectors)
│   ├── app.component.* # Root component
│   └── app.routes.ts  # Routing configuration
├── assets/            # Static resources
├── environments/      # Environment-specific configurations
├── index.html         # Static HTML
├── main.ts            # Application entry point
└── styles.scss        # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Angular CLI 18

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:4200`

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Run tests**:
   ```bash
   npm test
   ```

## Key Features Configured

### 1. API Service (`src/app/core/http/api.service.ts`)
- Generic HTTP client wrapper
- RESTful methods (GET, POST, PUT, DELETE)
- Error handling
- Environment-based API URL configuration

### 2. NgRx Store Configuration
- **Actions**: Define application events
- **Reducers**: Manage state changes
- **Effects**: Handle side effects (API calls)
- **Selectors**: Query state efficiently
- **Store DevTools**: Redux DevTools integration for debugging

Example store structure in `src/app/store/user/`:
```typescript
- user.actions.ts    // Action definitions
- user.reducer.ts    // State reducer
- user.effects.ts    // API calls and side effects
- user.selectors.ts  // State selectors
```

### 3. PrimeNG Integration
- Pre-configured theme (Lara Light Blue)
- Global styling in `src/styles.scss`
- Component library ready for use

Example PrimeNG components used in dashboard:
- `p-button`
- `p-card`

### 4. Environment Configuration
- Development: `src/environments/environment.ts`
- Production: `src/environments/environment.prod.ts`
- API URL configuration per environment

## Development Workflow

### Creating a New Feature
1. Generate component in `src/app/features/`
2. Define NgRx actions in `src/app/store/[feature]/`
3. Create reducer and effects for state management
4. Add selectors for state queries
5. Integrate component with store using `this.store.select()`

### API Integration Pattern
```typescript
// In service
this.api.get<T>('endpoint').subscribe(data => {...})

// In component with NgRx
this.store.dispatch(ActionName());
this.store.select(selector$).subscribe(data => {...})
```

## Environment Variables

Configure API endpoints in environment files:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  apiVersion: 'v1'
};
```

## Debugging

### NgRx Store DevTools
- Install [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools-extension)
- Monitor state changes in real-time
- Time-travel debugging enabled

### VS Code Debugging
- Use Angular CLI debug mode: `ng serve --poll 2000`
- Set breakpoints in DevTools or VS Code

## Resources

- [Angular Documentation](https://angular.io/docs)
- [NgRx Documentation](https://ngrx.io/docs)
- [PrimeNG Documentation](https://primeng.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## License

Proprietary - KronoHealth