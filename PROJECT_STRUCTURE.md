# CropCast Project Structure & Architecture

## Overview

CropCast is a full-stack agricultural AI application with:
- **Frontend:** Next.js 14+ (App Router, TypeScript, Tailwind CSS)
- **Backend:** .NET 8+ Web API
- **Database:** SQL Server
- **Authentication:** JWT-based with role support

---

## Frontend Structure

### `/app` - Next.js App Router

```
app/
├── layout.tsx                 # Root layout with AuthProvider & Toaster
├── page.tsx                   # Home/landing page
├── login/
│   └── page.tsx              # Login page (public)
├── register/
│   └── page.tsx              # Registration page (public)
├── predict/
│   └── page.tsx              # Crop prediction page (protected)
├── dashboard/
│   └── page.tsx              # User dashboard (protected)
├── api/
│   └── predict/
│       └── route.ts          # Local Gemini API endpoint (fallback)
└── globals.css               # Global Tailwind styles
```

**Key Features:**
- App Router for modern routing
- Server Components by default (better performance)
- Client Components where needed (auth, forms)
- Protected routes with `ProtectedRoute` wrapper
- Error boundaries for graceful error handling

### `/components` - Reusable Components

```
components/
├── auth/
│   ├── login-form.tsx        # Login form with validation
│   ├── register-form.tsx     # Registration form with validation
│   └── protected-route.tsx   # Wrapper for protected pages
│
├── ui/                        # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── toast.tsx
│   ├── toaster.tsx
│   └── ... (30+ components)
│
├── prediction-form.tsx        # Main crop prediction form
├── prediction-results.tsx     # Results display
├── location-data-entry.tsx    # Location-based data entry
├── dashboard-charts.tsx       # Charts & analytics
├── header.tsx                 # Navigation header
├── footer.tsx                 # Footer component
├── theme-provider.tsx         # Theme configuration
├── hero-section.tsx           # Landing page hero
└── features-section.tsx       # Features showcase
```

**Component Patterns:**
- All auth forms are "use client" components
- Forms use react-hook-form + Zod validation
- Toast notifications for feedback
- Loading states with spinners
- Error handling with Alert components

### `/lib` - Utilities & Services

```
lib/
├── api-client.ts              # Central API client
│   ├── ApiClient class
│   ├── Request/Response handling
│   ├── Error handling
│   ├── Token management
│   └── API endpoint definitions
│
├── auth-context.tsx           # Authentication context
│   ├── useAuth() hook
│   ├── User state management
│   ├── Login/Register/Logout
│   └── Session persistence
│
├── error-handler.ts           # Error handling utilities
│   ├── Error classification
│   ├── User-friendly messages
│   ├── Retry logic
│   └── Timeout handling
│
├── gemini-api.ts              # Google Gemini integration
│   ├── Crop prediction AI
│   ├── Prompt engineering
│   └── Response parsing
│
└── utils.ts                   # Helper functions
    └── cn() for Tailwind merging
```

**Key Utilities:**

**ApiClient** - Centralized HTTP requests
```typescript
import { apiClient, authApi, cropApi } from '@/lib/api-client'

// Login
const response = await authApi.login({ email, password })

// Predict crop
const prediction = await cropApi.predict(formData)
```

**useAuth** - Authentication hook
```typescript
import { useAuth } from '@/lib/auth-context'

function MyComponent() {
  const { user, login, logout, isAuthenticated, isLoading } = useAuth()
}
```

**ErrorHandler** - Error management
```typescript
import { ErrorHandler } from '@/lib/error-handler'

try {
  await apiClient.request(endpoint)
} catch (error) {
  ErrorHandler.logError(error, 'Component')
  const message = ErrorHandler.createUserFriendlyMessage(error)
}
```

### `/hooks` - Custom React Hooks

```
hooks/
├── use-toast.ts               # Toast notification hook
├── use-mobile.ts              # Mobile detection hook
└── [custom hooks]
```

---

## Data Flow Architecture

### Authentication Flow

```
User Input (LoginForm)
    ↓
useForm (react-hook-form)
    ↓
Form Validation (Zod)
    ↓
useAuth.login()
    ↓
apiClient.post('/api/auth/login')
    ↓
.NET Backend Authentication
    ↓
JWT Token Response
    ↓
apiClient.setToken(token)
    ↓
AuthContext updates
    ↓
useAuth() hook updates
    ↓
Components re-render with user data
```

### API Request Flow

```
Component → useAuth/apiClient
    ↓
lib/api-client.ts (ApiClient class)
    ↓
Headers added (JWT token)
    ↓
fetch() to backend
    ↓
Response parsing
    ↓
Error handling (if needed)
    ↓
Return typed response
    ↓
Component uses data
```

### Protected Route Flow

```
Navigate to /predict
    ↓
ProtectedRoute wrapper
    ↓
useAuth() hook checks isAuthenticated
    ↓
If not authenticated:
    → Redirect to /login
    
If authenticated:
    → Show page content
```

---

## Key Files Explained

### `/app/layout.tsx`
```typescript
// Root layout for entire app
// Wraps everything with:
// 1. AuthProvider - global auth state
// 2. Toaster - toast notifications
// 3. Analytics - Vercel analytics
```

### `/lib/api-client.ts`
```typescript
// Single source of truth for all API communication
// Handles:
// - Base URL configuration (NEXT_PUBLIC_API_URL)
// - JWT token management
// - Error handling & logging
// - Request/response formatting
// - CORS handling
```

### `/lib/auth-context.tsx`
```typescript
// Global authentication state
// Provides:
// - user: Current user object
// - isAuthenticated: Boolean flag
// - isLoading: Loading state
// - login/register/logout: Auth functions
// - error: Error messages
```

### `/components/auth/protected-route.tsx`
```typescript
// Wrapper component for protected pages
// Checks if user is authenticated
// Redirects to /login if not
// Shows loading skeleton while checking
```

---

## Configuration Files

### `.env.local` (Create from `.env.local.example`)
```
NEXT_PUBLIC_API_URL=http://localhost:5090
GOOGLE_GEMINI_API_KEY=your_key_here
```

### `package.json`
```json
{
  "dependencies": {
    "next": "14.2.16",
    "react": "^18",
    "react-hook-form": "^7.60.0",
    "zod": "3.25.67",
    "sonner": "^1.7.4"
  }
}
```

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]  // Path alias for imports
    }
  }
}
```

---

## Component Dependencies

### Login Form Dependencies
```
LoginForm
├── useForm (react-hook-form)
├── zodResolver (validation)
├── useRouter (navigation)
├── useAuth (authentication)
├── useToast (feedback)
└── UI Components
    ├── Button
    ├── Card
    ├── Input
    ├── Label
    └── Alert
```

### Prediction Form Dependencies
```
PredictionForm
├── useState (form state)
├── useRouter (navigation)
├── apiClient (API calls)
├── geminiPredictor (AI)
├── useToast (feedback)
└── UI Components
    ├── Card
    ├── Input
    ├── Select
    ├── Checkbox
    ├── Button
    └── Alert
```

---

## API Integration Points

### Authentication Endpoints
```
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
POST /api/auth/logout
```

### Crop Prediction Endpoints
```
POST /api/crop/predict
GET /api/crop/predictions
GET /api/crop/predictions/:id
```

### Health Endpoint
```
GET /api/health
```

---

## State Management

### Global State (Context)
- **AuthContext** - User authentication & session
- Located in `lib/auth-context.tsx`
- Provides `useAuth()` hook

### Local State (useState)
- Form inputs in components
- Loading/error states
- UI toggles

### Server State
- Prediction results (could add SWR)
- User preferences
- Prediction history

---

## Error Handling Strategy

### Client-Side
1. **Input Validation** - Zod schemas in forms
2. **API Error Handling** - ErrorHandler utility
3. **User Feedback** - Toast notifications
4. **Route Protection** - ProtectedRoute wrapper

### Error Boundaries (Planned)
```typescript
// Catch React component errors
// Display fallback UI
// Log to monitoring service
```

---

## Performance Optimizations

### Implemented
- Client Components only where needed
- Image optimization with Next.js Image
- CSS modules with Tailwind
- Form validation before submission
- Lazy route loading

### Recommendations
- Add SWR for data fetching & caching
- Implement memoization for expensive components
- Add code splitting for large modules
- Cache predictions in localStorage

---

## Security Considerations

### Implemented
- JWT token in localStorage (client-side auth)
- Protected routes with session checks
- CORS validation at backend
- Input validation with Zod
- Secure password handling

### To Implement
- CSRF protection
- Rate limiting
- Content Security Policy (CSP)
- Secure headers middleware
- API key rotation

---

## Development Workflow

### 1. Create New Page
```
1. Create app/[feature]/page.tsx
2. Wrap with ProtectedRoute if needed
3. Import components
4. Add metadata (title, description)
```

### 2. Create New API Integration
```
1. Add endpoint to lib/api-client.ts
2. Create service/utility if complex
3. Add error handling
4. Add debug logging
```

### 3. Create New Component
```
1. Create components/[feature].tsx
2. Add TypeScript interfaces
3. Use shadcn/ui components
4. Add error boundaries
5. Export from components/index.ts
```

### 4. Add Authentication
```
1. Wrap component with ProtectedRoute
2. Use useAuth() hook
3. Check isAuthenticated before showing content
4. Redirect to /login if needed
```

---

## Testing Strategy

### Unit Tests
- Component rendering
- Form validation
- Error handling
- API client functions

### Integration Tests
- Auth flow
- Prediction flow
- API communication

### E2E Tests
- Login journey
- Make prediction
- View results

---

## Deployment Considerations

### Frontend (Vercel)
```bash
# Environment variables needed
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
GOOGLE_GEMINI_API_KEY=your_key

# Build command
npm run build

# Start command
npm run start
```

### Backend (.NET on Azure/AWS)
- API_URL should be production domain
- CORS should allow production origin
- Database connection to production SQL Server
- JWT secret should be environment variable

### Environment Separation
```
Development:
- Frontend: http://localhost:3000
- Backend: http://localhost:5090

Staging:
- Frontend: https://staging.yourdomain.com
- Backend: https://staging-api.yourdomain.com

Production:
- Frontend: https://yourdomain.com
- Backend: https://api.yourdomain.com
```

---

## Troubleshooting

### Components not rendering
- Check if wrapped with AuthProvider
- Verify file paths in imports
- Check for TypeScript errors

### API calls failing
- Check NEXT_PUBLIC_API_URL is correct
- Verify backend CORS is configured
- Check network tab in DevTools
- Review console logs for [v0] debug messages

### Auth not working
- Verify .env.local has correct API URL
- Check token is stored in localStorage
- Ensure ProtectedRoute is used
- Review useAuth() hook implementation

---

## Related Documentation

- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Complete setup instructions
- [BACKEND_IMPLEMENTATION.md](./BACKEND_IMPLEMENTATION.md) - .NET API guide
- [DEBUG_CHECKLIST.md](./DEBUG_CHECKLIST.md) - Debugging guide
