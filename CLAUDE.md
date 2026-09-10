# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🏥 Hospital Management System (HMS)

A full-stack hospital management system with Express.js/TypeScript backend and React/TypeScript/Vite frontend. Features include user authentication, patient/doctor management, appointment scheduling, and dashboard analytics. Deployed on Netlify.

## 📁 Repository Structure

```
htmg/
├── hms-backend/          # Express.js/TypeScript backend (adapted for Netlify Functions)
│   ├── src/
│   │   ├── server.ts     # Main Express app (exported for serverless usage)
│   │   ├── db/           # Database connection & initialization
│   │   ├── middleware/   # Auth middleware
│   │   ├── routes/       # API route handlers
│   │   └── config/       # Validation schemas
│   ├── netlify/          # Netlify Functions source
│   │   └── functions/
│   │       └── serverless.ts  # Serverless wrapper using serverless-http
│   ├── dist/             # Compiled output (not committed)
│   ├── package.json      # Backend dependencies
│   ├── tsconfig.json     # TypeScript configuration for src
│   └── tsconfig.functions.json  # TypeScript configuration for functions
├── hms-frontend/         # React/TypeScript/Vite frontend
│   ├── src/
│   │   ├── App.tsx       # Main app component
│   │   ├── components/   # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # API client
│   │   ├── pages/        # Page components
│   │   └── types/        # TypeScript interfaces
│   ├── package.json      # Frontend dependencies
│   ├── vite.config.ts    # Vite configuration
│   └── tsconfig.json     # TypeScript configuration
├── netlify.toml          # Netlify configuration
├── package.json          # Root package.json with build scripts
├── .gitignore            # Git ignore rules
└── skill.md              # Document of installed Netlify skills
```

## ⚙️ Development Commands

### Backend Development
```bash
# Install dependencies
cd hms-backend && npm ci

# Run development server (with auto-reload)
npm run dev

# Build src only
npm run build

# Build functions only
npm run build:functions

# Build all (src + functions)
npm run build:all

# Start production server locally
npm start

# Run type checking
npx tsc --noEmit
```

### Frontend Development
```bash
# Install dependencies
cd hms-frontend && npm ci

# Run development server (with HMR)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Run type checking
npx tsc --noEmit
```

### Building Both Services
```bash
# From project root
npm run build:all
```

Or build individually:
```bash
# Build backend
npm run build:backend

# Build frontend
npm run build:frontend
```

## 🔧 Common Development Tasks

### Running a Single Test
While this project doesn't currently have a test framework configured, you can:
1. Add Jest or Vitest for testing
2. Create test files in `src/__tests__/` directories
3. Run with `npm test` (after configuring)

### Database Operations
The backend uses PostgreSQL with these key operations:
- Database initialization creates tables for users, patients, doctors, appointments
- Connection pooling handled in `src/db/index.ts` (optimized for serverless reuse)
- Parameterized queries prevent SQL injection
- Indexes created for performance optimization

### Authentication Flow
1. User registers/logs in via `/.netlify/functions/api/auth/register` or `/.netlify/functions/api/auth/login`
2. Backend returns JWT token stored in frontend `localStorage`
3. Frontend includes token in Authorization header for API requests
4. Backend validates token and attaches user to request object
5. Role-based access control enforced via middleware

### API Endpoints
All API endpoints are served via Netlify Functions at `/.netlify/functions/api`:
- `POST /.netlify/functions/api/auth/register` - User registration
- `POST /.netlify/functions/api/auth/login` - User login
- `GET /.netlify/functions/api/auth/me` - Get current user
- `GET /.netlify/functions/api/patients` - List patients (with search)
- `POST /.netlify/functions/api/patients` - Create patient
- `GET /.netlify/functions/api/doctors` - List doctors (with search)
- `POST /.netlify/functions/api/doctors` - Create doctor
- `GET /.netlify/functions/api/appointments` - List appointments
- `POST /.netlify/functions/api/appointments` - Create appointment (conflict-checked)
- `PUT /.netlify/functions/api/appointments/:id/status` - Update appointment status
- `GET /.netlify/functions/api/dashboard/stats` - Get dashboard statistics

## 🏗️ Architecture Overview

### Backend Architecture
- **Express.js** server with TypeScript for type safety
- **Modular routing** - Separate route files for each resource
- **Middleware pattern** - Authentication and role-based access control
- **Database layer** - PostgreSQL connection pool with query helpers (optimized for serverless)
- **Validation layer** - Zod schemas for input validation with TypeScript inference
- **Environment configuration** - Uses process.env for configuration
- **Netlify Functions** - Express app wrapped with serverless-http for serverless usage
- **Serverless wrapper** - `netlify/functions/serverless.ts` imports the app and wraps it with serverless-http
- **Graceful shutdown** - Proper cleanup of database connections

### Frontend Architecture
- **React 19** with **TypeScript** for type-safe components
- **Vite** for fast development server and optimized builds
- **Custom hooks** - Encapsulate API calls and state management
- **Component library** - Reusable primitive UI components with design system
- **Layout system** - Consistent sidebar navigation with role-based access
- **API client** - Centralized fetch wrapper with automatic auth header injection
- **Type safety** - Shared TypeScript interfaces between API and components

### Deployment Architecture
- **Netlify platform** deployment via `netlify.toml`
- **Frontend**: Static site served from `/hms-frontend/dist`
- **Backend**: Netlify Functions served from `/hms-backend/dist/functions`
- **Build process**: Root package.json runs `build:all` which builds both frontend and backend
- **Environment variables**:
  - `DATABASE_URL` - PostgreSQL connection string
  - `CORS_ORIGIN` - Frontend URL for CORS (set to Netlify site URL)
  - `JWT_SECRET` - Secret for JWT signing
  - `VITE_API_URL` - Frontend API endpoint (set to `/.netlify/functions/api` during builds)
  - `NODE_ENV` - Set to "production"

## 🔑 Key Files to Understand

### Backend
- `hms-backend/src/server.ts` - Main application entry point (exports app for serverless usage)
- `hms-backend/netlify/functions/serverless.ts` - Netlify Function wrapper using serverless-http
- `hms-backend/src/db/index.ts` - Database connection and initialization
- `hms-backend/src/middleware/auth.ts` - JWT authentication middleware
- `hms-backend/src/routes/auth.ts` - Authentication endpoints
- `hms-backend/src/routes/patients.ts` - Patient management endpoints
- `hms-backend/src/routes/doctors.ts` - Doctor management endpoints
- `hms-backend/src/routes/appointments.ts` - Appointment scheduling with conflict detection
- `hms-backend/src/routes/dashboard.ts` - Dashboard statistics endpoints
- `hms-backend/src/config/schemas.ts` - Zod validation schemas
- `hms-backend/tsconfig.functions.json` - TypeScript configuration for Netlify Functions

### Frontend
- `hms-frontend/src/App.tsx` - Main application component
- `hms-frontend/src/lib/api.ts` - API client with auth header injection (configured for Netlify Functions)
- `hms-frontend/src/hooks/index.ts` - Custom React hooks for data fetching
- `hms-frontend/src/components/layout/index.tsx` - Sidebar navigation with role-based access
- `hms-frontend/src/components/primitives/index.tsx` - Reusable UI component library
- `hms-frontend/src/pages/auth.tsx` - Login and registration pages
- `hms-frontend/src/pages/dashboard.tsx` - Dashboard with appointment stats
- `hms-frontend/src/types/index.ts` - TypeScript interfaces for API responses

## 📱 Environment Variables

### Netlify Site Settings (Dashboard or netlify.toml)
```
DATABASE_URL=postgresql://...
CORS_ORIGIN=https://your-netlify-site.netlify.app
JWT_SECRET=your-super-secret-jwt-key-change-in-production
VITE_API_URL=/.netlify/functions/api
```

### Frontend Build Environment (netlify.toml)
```toml
[build.environment]
  VITE_API_URL = "/.netlify/functions/api"
```

## 🛠️ Code Quality Standards

### TypeScript
- Strict mode enabled in both backend and frontend
- Interface-based typing for API responses
- Proper error handling with try/catch blocks
- Meaningful variable and function names

### Backend Standards
- RESTful API design with proper HTTP status codes
- Input validation using Zod schemas
- Parameterized SQL queries to prevent injection
- Role-based access control middleware
- Consistent error response format
- Proper connection pooling and cleanup (optimized for serverless)
- Netlify Function wrapper using serverless-http
- App exported for serverless usage (not auto-started when imported)

### Frontend Standards
- Functional components with React hooks
- Consistent UI component library with design tokens
- Proper loading and error states
- Accessible form controls with labels
- Responsive design principles
- Optimistic UI updates where appropriate

## 🚀 Deployment

The application is configured for deployment on Netlify:
1. Push to main branch triggers Netlify build
2. Netlify runs `npm run build-all` which:
   - Builds backend: `tsc` + `tsc -p tsconfig.functions.json`
   - Builds frontend: `tsc -b && vite build`
3. Frontend served from `hms-frontend/dist`
4. Backend served as Netlify Functions from `hms-backend/dist/functions`
5. Automatic deployments on push to main branch
6. Deploy Previews for branch deployments
7. Edge Functions available via `/netlify/edge-functions` (if configured)

## 🔍 Debugging Tips

### Backend
- Check Netlify Function logs in Netlify Dashboard
- Verify environment variables are set correctly in Netlify Site Settings
- Test API endpoints via Netlify Dashboard or curl
- Check database connection and table initialization
- Look for CORS issues in browser dev tools (ensure CORS_ORIGIN matches frontend URL)
- Check function timing and memory usage in Netlify Dashboard

### Frontend
- Check browser console for React errors
- Verify API URL is correct (should be `/.netlify/functions/api` relative to site)
- Check network tab for failed requests
- Verify JWT token is being sent in Authorization header
- Test with different user roles to see role-based UI
- Check Netlify Build logs for build failures

## 📝 Contributing Guidelines

1. Follow existing code style and patterns
2. Write clear, descriptive commit messages
3. Add JSDoc comments for complex functions
4. Ensure TypeScript compiles without errors
5. Test both backend and frontend changes
6. Consider security implications of changes
7. Update documentation when adding new features
8. Ensure Netlify Functions build correctly
9. Test locally with `netlify dev` before pushing