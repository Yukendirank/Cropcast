# CropCast - Quick Start Guide

Get your CropCast application running in 5 minutes!

---

## Frontend Setup (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment
```bash
# Copy the example file
cp .env.local.example .env.local

# Edit .env.local
# Change NEXT_PUBLIC_API_URL to your backend URL
# Add your Google Gemini API key
```

**`.env.local` should contain:**
```
NEXT_PUBLIC_API_URL=http://localhost:5090
GOOGLE_GEMINI_API_KEY=your_key_here
```

### Step 3: Start Development Server
```bash
npm run dev
```

Frontend is now running at: **http://localhost:3000**

---

## Backend Setup (10 minutes)

### Step 1: Create .NET Project
```bash
dotnet new webapi -n CropCast.API
cd CropCast.API
```

### Step 2: Add NuGet Packages
```bash
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package BCrypt.Net-Core
```

### Step 3: Update Program.cs
Copy the **complete Program.cs** from `BACKEND_IMPLEMENTATION.md`

Key points:
- Add CORS configuration for `http://localhost:3000`
- Add JWT authentication
- Ensure middleware order: CORS → Auth → Authorization → Routes

### Step 4: Configure appsettings.json
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=CropCastDb;Trusted_Connection=true;"
  },
  "Jwt": {
    "Secret": "your-super-secret-key-that-is-at-least-32-characters-long",
    "Issuer": "CropCast",
    "Audience": "CropCastUsers",
    "ExpiryMinutes": 1440
  }
}
```

### Step 5: Create Models
Copy all models from `BACKEND_IMPLEMENTATION.md`:
- `User.cs`
- `LoginRequest.cs` / `RegisterRequest.cs`
- `CropPredictionRequest.cs` / `PredictionResponse.cs`

### Step 6: Create Services
Copy all services from `BACKEND_IMPLEMENTATION.md`:
- `JwtService.cs`
- `AuthService.cs`
- `CropPredictionService.cs`

### Step 7: Create Controllers
Copy all controllers from `BACKEND_IMPLEMENTATION.md`:
- `AuthController.cs`
- `CropController.cs`

### Step 8: Create Database Context
Copy `AppDbContext.cs` from `BACKEND_IMPLEMENTATION.md`

### Step 9: Run Migrations
```bash
dotnet ef database update
```

### Step 10: Start Backend
```bash
dotnet run
```

Backend is now running at: **http://localhost:5090**

---

## Test the Connection

### 1. Test Backend Health
```bash
curl http://localhost:5090/api/health

# Expected response:
# {"status":"healthy"}
```

### 2. Test Frontend Connection
1. Open http://localhost:3000 in browser
2. Open DevTools (F12)
3. Go to Console tab
4. Run:
```javascript
fetch('http://localhost:5090/api/health')
  .then(r => r.json())
  .then(d => console.log('Health:', d))
  .catch(e => console.error('Error:', e.message))
```

Expected output: `Health: {status: 'healthy'}`

### 3. Test Login Flow
1. Navigate to http://localhost:3000/login
2. Use test credentials:
   - Email: `test@example.com`
   - Password: `password`
3. Check console for `[v0]` debug logs
4. Should redirect to dashboard on success

---

## File Reference

### Frontend Files Created

```
New files:
- lib/api-client.ts                 # Central API client
- lib/auth-context.tsx             # Auth state management
- lib/error-handler.ts             # Error utilities
- components/auth/login-form.tsx   # Login form
- components/auth/register-form.tsx # Registration form
- components/auth/protected-route.tsx # Route protection
- app/login/page.tsx               # Login page
- app/register/page.tsx            # Registration page

Updated files:
- app/layout.tsx                   # Added AuthProvider
- app/predict/page.tsx             # Added ProtectedRoute

Documentation:
- .env.local.example               # Environment template
- SETUP_GUIDE.md                   # Complete setup guide
- BACKEND_IMPLEMENTATION.md        # .NET backend code
- DEBUG_CHECKLIST.md              # Debugging guide
- CORS_CONFIGURATION.md           # CORS setup guide
- PROJECT_STRUCTURE.md            # Architecture overview
- QUICK_START.md                  # This file
```

---

## Common Issues & Solutions

### "Failed to fetch" Error
**Issue:** Can't connect to backend

**Solution:**
1. Verify backend is running on `http://localhost:5090`
2. Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
3. Restart Next.js dev server

### CORS Error
**Issue:** Browser blocks cross-origin request

**Solution:**
1. Ensure `Program.cs` has CORS configured for `http://localhost:3000`
2. Check `UseCors()` is BEFORE `UseAuthentication()`
3. Restart backend

### Environment Variables Not Loading
**Issue:** `process.env.NEXT_PUBLIC_API_URL` is undefined

**Solution:**
1. Create `.env.local` file (not just `.env`)
2. Add `NEXT_PUBLIC_` prefix to variable names
3. Restart Next.js dev server

### Database Connection Failed
**Issue:** Can't connect to SQL Server

**Solution:**
1. Verify SQL Server is running
2. Check connection string in `appsettings.json`
3. Run `dotnet ef database update` to create schema

### 401 Unauthorized
**Issue:** API rejects authenticated requests

**Solution:**
1. Check token is stored: `localStorage.getItem('auth_token')`
2. Verify JWT secret in backend config
3. Check token hasn't expired
4. Try logging in again

---

## Next Steps

### 1. Add More Features
- [ ] User profile page
- [ ] Prediction history
- [ ] Weather integration
- [ ] Real-time notifications
- [ ] Admin dashboard

### 2. Improve Security
- [ ] Add rate limiting
- [ ] Implement CSRF protection
- [ ] Add Content Security Policy
- [ ] Enable HTTPS in production

### 3. Optimize Performance
- [ ] Add caching with SWR
- [ ] Implement code splitting
- [ ] Optimize images
- [ ] Add monitoring

### 4. Deploy
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Azure/AWS
- [ ] Set up CI/CD pipeline
- [ ] Configure production CORS

---

## Key APIs

### Authentication
```javascript
// Login
const response = await fetch('http://localhost:5090/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com', password: 'password' })
})
const { token, user } = await response.json()

// Get current user
const userRes = await fetch('http://localhost:5090/api/auth/me', {
  headers: { 'Authorization': `Bearer ${token}` }
})
const currentUser = await userRes.json()
```

### Crop Prediction
```javascript
const response = await fetch('http://localhost:5090/api/crop/predict', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    rainfall: 120,
    temperature: 28,
    humidity: 65,
    // ... other fields
  })
})
const prediction = await response.json()
```

---

## Using the Frontend Code

### useAuth Hook
```typescript
import { useAuth } from '@/lib/auth-context'

function MyComponent() {
  const { user, login, logout, isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Not logged in</div>
  
  return <div>Hello {user?.name}</div>
}
```

### API Client
```typescript
import { apiClient, authApi, cropApi } from '@/lib/api-client'

// Login
const response = await authApi.login({ email, password })
apiClient.setToken(response.token)

// Predict
const prediction = await cropApi.predict(formData)

// Get user
const user = await authApi.getCurrentUser()
```

### Protected Routes
```typescript
import { ProtectedRoute } from '@/components/auth/protected-route'

export default function MyPage() {
  return (
    <ProtectedRoute>
      <div>Only authenticated users see this</div>
    </ProtectedRoute>
  )
}
```

---

## Useful Commands

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run linter
```

### Backend
```bash
dotnet run           # Start development server
dotnet build         # Build project
dotnet ef database update  # Run migrations
dotnet ef migrations add InitialCreate  # Create new migration
```

---

## Documentation Files

1. **SETUP_GUIDE.md** - Complete installation & debugging
2. **BACKEND_IMPLEMENTATION.md** - Full .NET backend code
3. **DEBUG_CHECKLIST.md** - Step-by-step debugging
4. **CORS_CONFIGURATION.md** - CORS setup details
5. **PROJECT_STRUCTURE.md** - Architecture overview
6. **QUICK_START.md** - This file!

---

## Need Help?

1. Check the **DEBUG_CHECKLIST.md** for common issues
2. Review **SETUP_GUIDE.md** for detailed configuration
3. Look at **BACKEND_IMPLEMENTATION.md** for code examples
4. Check browser DevTools Console for `[v0]` debug logs

---

## Success Criteria

You'll know everything is working when:

- [ ] Frontend loads at `http://localhost:3000`
- [ ] Backend responds at `http://localhost:5090/api/health`
- [ ] Can register at `/register`
- [ ] Can login at `/login`
- [ ] Token is stored in localStorage
- [ ] Can access `/predict` page
- [ ] No CORS errors in browser console
- [ ] Console shows `[v0]` debug logs

Happy farming with CropCast!
