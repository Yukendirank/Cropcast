# CropCast Frontend-Backend Integration Guide

## Quick Start

### 1. Frontend Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Edit .env.local with your settings
```

### 2. Environment Variables (`.env.local`)

```
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5090

# Google Gemini API (for crop predictions)
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
```

**Important:** The `NEXT_PUBLIC_` prefix makes these variables accessible in the browser.

### 3. Backend CORS Configuration

Your .NET API MUST be configured to accept requests from `http://localhost:3000`.

#### Program.cs - Correct Configuration

```csharp
var builder = WebApplicationBuilder.CreateBuilder(args);

// Add services
builder.Services.AddControllers();

// Configure CORS BEFORE auth
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials(); // Important for cookies
    });
});

var app = builder.Build();

// Middleware order is critical!
app.UseCors("AllowLocalhost"); // Must come BEFORE auth

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
```

### 4. API Response Format

Your .NET API should return JSON in this format:

**Login Endpoint** (`POST /api/auth/login`)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Crop Prediction Endpoint** (`POST /api/crop/predict`)
```json
{
  "predicted_yield_kg_per_hectare": 5000,
  "confidence_score": 0.85,
  "recommendations": ["Use drip irrigation", "Apply moderate fertilizer"],
  "risk_factors": ["High temperature risk"]
}
```

**Error Response** (4xx/5xx)
```json
{
  "message": "Invalid credentials",
  "details": "Email not found"
}
```

---

## Debugging Guide

### Issue 1: "Failed to fetch" Error

**Cause:** Backend is not running or API URL is wrong.

**Solution:**
1. Verify backend is running on `http://localhost:5090`
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Run frontend dev server: `npm run dev`
4. Open browser DevTools → Console → Check for error messages

**Debug Output** (check browser console):
```
[v0] ApiClient initialized with baseUrl: http://localhost:5090
[v0] API Request: { url: "http://localhost:5090/api/auth/login", method: "POST", hasBody: true }
[v0] API Response: { status: 200 }
```

### Issue 2: CORS Error

**Cause:** Backend CORS not configured or frontend origin not allowed.

**Error Message:**
```
Access to XMLHttpRequest at 'http://localhost:5090/api/auth/login' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution:**
1. Check `Program.cs` has `UseCors()` BEFORE `UseAuthentication()`
2. Verify origin matches exactly: `http://localhost:3000`
3. Ensure `AllowCredentials()` is set for cookie-based auth
4. Restart backend after CORS changes

### Issue 3: 401 Unauthorized

**Cause:** Token is missing or invalid.

**Solution:**
1. Check token is stored: `localStorage.getItem("auth_token")`
2. Verify token format: `Bearer <token>`
3. Check token hasn't expired
4. Verify backend JWT validation key

**Backend JWT Validation** (Program.cs):
```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes("your-secret-key-here-min-32-chars")),
            ValidateIssuer = true,
            ValidIssuer = "your-issuer",
            ValidateAudience = true,
            ValidAudience = "your-audience",
        };
    });
```

### Issue 4: Network Tab Shows Nothing

**Cause:** Request is being blocked before reaching network.

**Solution:**
1. Open DevTools → Network tab
2. Clear cookies: DevTools → Application → Storage → Clear All
3. Check if AdBlock is blocking requests
4. Verify JavaScript is enabled
5. Try incognito/private mode

### Issue 5: Wrong Port/URL Issues

**Symptoms:**
- 404 errors on API calls
- Timeout errors
- Connection refused

**Check List:**
```bash
# Verify backend is running
# Should respond with 200 or 401, not "Connection refused"
curl http://localhost:5090/api/health

# Verify frontend can reach backend
# In browser console:
fetch('http://localhost:5090/api/health').then(r => r.json()).then(console.log)

# Check environment variables are loaded
# In browser console (Next.js App Router):
console.log(process.env.NEXT_PUBLIC_API_URL)
```

---

## Frontend Architecture

### API Client (`lib/api-client.ts`)

Handles all HTTP requests with:
- Automatic error handling
- JWT token management
- Debug logging
- Error message extraction

**Usage:**
```typescript
import { apiClient, authApi, cropApi } from "@/lib/api-client"

// Login
const response = await authApi.login({ email, password })
apiClient.setToken(response.token)

// Predict crop
const prediction = await cropApi.predict(formData)

// Get authenticated user
const user = await authApi.getCurrentUser()
```

### Authentication Context (`lib/auth-context.tsx`)

Provides:
- Global auth state management
- User session persistence
- Login/logout functionality
- Auto-login on app load

**Usage:**
```typescript
import { useAuth } from "@/lib/auth-context"

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth()
  
  return <div>{user?.name}</div>
}
```

### Components

**Login Form** (`components/auth/login-form.tsx`)
- Email/password validation
- Error handling
- Loading states
- Toast notifications

**Register Form** (`components/auth/register-form.tsx`)
- Password confirmation
- Name validation
- Auto-login after registration

---

## API Endpoints Reference

### Authentication

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| POST | `/api/auth/register` | `{ email, password, name }` | `{ token, user }` |
| POST | `/api/auth/login` | `{ email, password }` | `{ token, user }` |
| GET | `/api/auth/me` | - | `{ id, email, name }` |
| POST | `/api/auth/logout` | - | `{ message: "ok" }` |

### Crop Prediction

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| POST | `/api/crop/predict` | CropData | PredictionResponse |
| GET | `/api/crop/predictions` | - | `Prediction[]` |
| GET | `/api/crop/predictions/:id` | - | Prediction |

### Headers

All requests include:
```
Content-Type: application/json
Authorization: Bearer <token> (if authenticated)
```

---

## Testing the Integration

### 1. Test Login Flow

```bash
# Start frontend
npm run dev

# Navigate to http://localhost:3000/login
# Enter credentials
# Check DevTools Console for debug logs
```

### 2. Test API Call

Open browser console and run:
```javascript
// Login
const loginRes = await fetch('http://localhost:5090/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com', password: 'password' })
})
const loginData = await loginRes.json()
console.log(loginData)

// Use token
fetch('http://localhost:5090/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${loginData.token}`
  }
})
```

### 3. Monitor with Browser DevTools

1. Open DevTools (F12)
2. Network tab → Monitor all requests
3. Console tab → Check debug logs
4. Application tab → Check localStorage for `auth_token`

---

## Performance Tips

1. **Lazy Load Routes**: Use dynamic imports for auth pages
   ```typescript
   const LoginPage = dynamic(() => import('./login'), { ssr: false })
   ```

2. **Cache Predictions**: Store recent predictions in localStorage
   ```typescript
   const cached = localStorage.getItem('prediction_cache')
   ```

3. **Debounce Form Submission**: Prevent double-submits
   ```typescript
   const [isSubmitting, setIsSubmitting] = useState(false)
   ```

4. **Use SWR for Data Fetching**: For prediction history
   ```typescript
   import useSWR from 'swr'
   const { data } = useSWR('/api/crop/predictions', apiClient.get)
   ```

---

## Troubleshooting Checklist

- [ ] Backend running on `http://localhost:5090`
- [ ] Frontend running on `http://localhost:3000`
- [ ] `.env.local` exists with correct `NEXT_PUBLIC_API_URL`
- [ ] CORS enabled in `Program.cs`
- [ ] `UseCors()` before `UseAuthentication()`
- [ ] JWT secret key configured
- [ ] Dependencies installed (`npm install`)
- [ ] Browser console shows debug logs (no errors)
- [ ] Network tab shows requests being sent
- [ ] Response has correct JSON format

---

## Next Steps

1. **Implement Protected Routes**: Redirect unauthenticated users
   ```typescript
   if (!isAuthenticated) router.push('/login')
   ```

2. **Add Real Predictions**: Use `.NET` backend instead of Gemini
   ```typescript
   const prediction = await cropApi.predict(formData)
   ```

3. **Prediction History**: Show user's past predictions
   ```typescript
   const history = await cropApi.getPredictionHistory()
   ```

4. **Weather Integration**: Fetch real weather data
   ```typescript
   const weather = await weatherApi.getCurrentWeather(lat, lon)
   ```

---

## Support

If you encounter issues:
1. Check the debugging guide above
2. Review browser DevTools Console for error messages
3. Verify all environment variables are set
4. Check backend is responding to requests
5. Ensure CORS is properly configured
