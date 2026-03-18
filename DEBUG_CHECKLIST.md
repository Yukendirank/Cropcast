# CropCast Frontend-Backend Connection - Debugging Checklist

Use this checklist to systematically debug connection issues between your Next.js frontend and .NET backend.

## Before You Start

- [ ] Backend (.NET) is running on `http://localhost:5090`
- [ ] Frontend (Next.js) is running on `http://localhost:3000`
- [ ] You have access to browser DevTools (F12)
- [ ] You have a terminal/command prompt open

---

## Step 1: Verify Backend is Running

### 1.1 Backend Accessibility Test
```bash
# In terminal, test if backend is responding
curl http://localhost:5090/api/health

# Expected response:
# {"status":"healthy"}
```

**If this fails:**
- [ ] Check if .NET application is running
- [ ] Verify it's running on port 5090
- [ ] Check for error messages in .NET console
- [ ] Try restarting the backend

### 1.2 Backend CORS Test
```bash
# From frontend terminal
curl -i -X OPTIONS http://localhost:5090/api/auth/login \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST"

# Look for these headers in response:
# Access-Control-Allow-Origin: http://localhost:3000
# Access-Control-Allow-Methods: POST
# Access-Control-Allow-Headers: *
```

**If CORS headers are missing:**
- [ ] Check `Program.cs` has `AddCors()`
- [ ] Verify `UseCors()` is called BEFORE `UseAuthentication()`
- [ ] Check CORS policy includes `http://localhost:3000`
- [ ] Ensure `AllowCredentials()` is set
- [ ] Restart backend after changes

---

## Step 2: Verify Frontend Environment

### 2.1 Check .env.local
```bash
# In project root, verify file exists
ls .env.local

# Check content
cat .env.local
```

**Should contain:**
```
NEXT_PUBLIC_API_URL=http://localhost:5090
GOOGLE_GEMINI_API_KEY=your_key_here
```

### 2.2 Verify Environment Variables Load
1. Open frontend in browser (http://localhost:3000)
2. Open DevTools (F12)
3. Go to Console tab
4. Run this command:
```javascript
console.log(process.env.NEXT_PUBLIC_API_URL)
// Should output: http://localhost:5090
```

**If it shows undefined:**
- [ ] Copy `.env.local.example` to `.env.local`
- [ ] Edit `.env.local` with correct values
- [ ] Restart Next.js dev server (Ctrl+C, npm run dev)
- [ ] Verify no typos in variable names (must start with `NEXT_PUBLIC_`)

---

## Step 3: Test API Connection from Browser Console

### 3.1 Direct Fetch Test
Open browser console and run:

```javascript
// Test health endpoint
fetch('http://localhost:5090/api/health')
  .then(r => r.json())
  .then(d => console.log("[v0] Health check:", d))
  .catch(e => console.error("[v0] Health check failed:", e.message))
```

**Expected output:** `{"status": "healthy"}`

**If "Failed to fetch" error:**
- [ ] Confirm backend is running
- [ ] Check API_BASE_URL is correct
- [ ] Try with full URL in browser address bar
- [ ] Check browser Network tab for CORS errors

### 3.2 Login Test
```javascript
// Test login endpoint
fetch('http://localhost:5090/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password'
  })
})
  .then(r => r.json())
  .then(d => {
    console.log("[v0] Login response:", d)
    if (d.token) {
      localStorage.setItem('auth_token', d.token)
      console.log("[v0] Token stored")
    }
  })
  .catch(e => console.error("[v0] Login failed:", e.message))
```

**If request fails:**
- Check Network tab to see actual response status
- Verify email/password are correct
- Check backend logs for error details
- Ensure database is accessible

### 3.3 Authenticated Request Test
```javascript
// Get stored token
const token = localStorage.getItem('auth_token')
console.log("[v0] Token:", token)

// Test authenticated endpoint
fetch('http://localhost:5090/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
  .then(r => r.json())
  .then(d => console.log("[v0] User data:", d))
  .catch(e => console.error("[v0] Failed:", e.message))
```

**If 401 Unauthorized:**
- [ ] Token might be expired
- [ ] Check token format: `Bearer <token>`
- [ ] Verify JWT secret in backend matches
- [ ] Check token hasn't been tampered with

---

## Step 4: Monitor Network Tab

### 4.1 Capture Login Request
1. Open DevTools → Network tab
2. Check "Preserve logs"
3. Click login button on your app
4. Look for POST request to `/api/auth/login`

**For each request, verify:**

| Item | What to Check |
|------|---------------|
| **URL** | Should be `http://localhost:5090/api/auth/login` |
| **Method** | Should be `POST` |
| **Status** | Should be 200 (or 401 if wrong credentials) |
| **Headers** | Should include `Content-Type: application/json` |
| **Response** | Should have `token` and `user` fields |

### 4.2 Check CORS Headers
Look for the OPTIONS preflight request:

**Request headers:**
- [ ] `Origin: http://localhost:3000`
- [ ] `Access-Control-Request-Method: POST`

**Response headers:**
- [ ] `Access-Control-Allow-Origin: http://localhost:3000`
- [ ] `Access-Control-Allow-Methods: POST, GET, OPTIONS`
- [ ] `Access-Control-Allow-Headers: *` (or specific headers)
- [ ] `Access-Control-Allow-Credentials: true`

**If these headers are missing:**
- Backend CORS is not configured
- Check `Program.cs` CORS setup
- Restart backend

---

## Step 5: Check Console Logs

### 5.1 Frontend Console (Browser)
Open DevTools → Console tab and look for `[v0]` logs:

```
[v0] ApiClient initialized with baseUrl: http://localhost:5090
[v0] API Request: { url: "...", method: "POST", hasBody: true }
[v0] API Response: { url: "...", status: 200, statusText: "OK" }
[v0] User logged in: user@example.com
```

### 5.2 Backend Console (.NET)
Look for requests being logged:

```
info: CropCast.API.Controllers.AuthController[0]
  POST /api/auth/login - 200 OK

warn: Microsoft.AspNetCore.Cors.Infrastructure.CorsMiddleware[3]
  CORS policy 'AllowLocalhost' did not allow origin 'http://localhost:3000'
```

**If CORS warning appears:**
- Check origin string matches exactly
- Verify CORS is enabled in Program.cs
- Restart backend

---

## Step 6: Test Login Form on Frontend

### 6.1 Login Form Test
1. Navigate to `http://localhost:3000/login`
2. Open DevTools Console
3. Enter test credentials
4. Click "Login"
5. Check console for logs:

```
[v0] ApiClient initialized with baseUrl: http://localhost:5090
[v0] API Request: { url: "http://localhost:5090/api/auth/login", method: "POST" }
[v0] API Response: { status: 200 }
[v0] Token stored
[v0] User logged in: test@example.com
```

### 6.2 Check Success Indicators
- [ ] Toast notification appears ("You have been logged in")
- [ ] Page redirects to `/dashboard`
- [ ] Token is stored in localStorage
- [ ] Network tab shows 200 response

### 6.3 If Login Fails
Check console for error message:

| Error | Solution |
|-------|----------|
| "Cannot connect to API" | Backend not running, wrong port |
| "CORS error" | CORS not configured in backend |
| "Invalid credentials" | Wrong email/password, or user doesn't exist |
| "Failed to parse JSON" | Backend response format wrong |
| "401 Unauthorized" | Token invalid or expired |

---

## Step 7: Specific Error Solutions

### Error: "Failed to fetch"
```
Access to XMLHttpRequest at 'http://localhost:5090/...' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solutions (in order):**
1. [ ] Verify backend is running: `curl http://localhost:5090/api/health`
2. [ ] Check CORS in `Program.cs`:
   ```csharp
   app.UseCors("AllowLocalhost"); // Must be BEFORE auth
   ```
3. [ ] Verify origin in CORS policy:
   ```csharp
   .WithOrigins("http://localhost:3000") // No trailing slash
   ```
4. [ ] Restart backend
5. [ ] Clear browser cache (Ctrl+Shift+Delete)
6. [ ] Try incognito/private mode

### Error: "Invalid JSON"
```
SyntaxError: Unexpected token < in JSON at position 0
```

**Solution:**
Backend is returning HTML instead of JSON (probably an error page)

1. [ ] Check backend logs for error
2. [ ] Test endpoint with curl:
   ```bash
   curl -X POST http://localhost:5090/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password"}'
   ```
3. [ ] Verify endpoint exists and handler is correct
4. [ ] Check database connection

### Error: "401 Unauthorized"
```
Response: 401, Message: "Unauthorized"
```

**Solutions:**
1. [ ] Check token is stored: `localStorage.getItem('auth_token')`
2. [ ] Verify token format in Authorization header: `Bearer <token>`
3. [ ] Check JWT secret in backend config
4. [ ] Verify token hasn't expired
5. [ ] Try logging in again

### Error: "Network Tab Shows Nothing"
Request isn't appearing in Network tab at all

**Solutions:**
1. [ ] Check "Preserve logs" is enabled
2. [ ] Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
3. [ ] Clear localStorage: `localStorage.clear()`
4. [ ] Try incognito mode (disable extensions)
5. [ ] Check browser console for JavaScript errors

---

## Step 8: Performance and Optimization Tests

### 8.1 Check Request Size
In Network tab, look at Request/Response sizes:

- Request should be < 1KB
- Response should be < 5KB
- Total time should be < 500ms

If response is slow:
- [ ] Check database query performance
- [ ] Look for N+1 queries
- [ ] Verify network latency

### 8.2 Check Cache
- [ ] Tokens are cached in localStorage
- [ ] API responses are cached appropriately
- [ ] Don't fetch same data multiple times

---

## Step 9: Troubleshooting Template

Fill this out when debugging:

**Issue:** _____________________

**Environment:**
- Frontend running: [ ] Yes [ ] No (Where? _______)
- Backend running: [ ] Yes [ ] No (Where? _______)
- API URL: ___________________

**Steps Taken:**
- [ ] Checked backend is running
- [ ] Checked CORS configuration
- [ ] Checked environment variables
- [ ] Checked console logs
- [ ] Checked Network tab
- [ ] Tested with curl

**Error Message:** _____________________

**Network Tab Status:** _____________________

**Console Logs:**
```
[paste relevant logs here]
```

**Solution Found:** _____________________

---

## Quick Command Reference

```bash
# Check if backend is running
curl http://localhost:5090/api/health

# View frontend environment variables
echo $NEXT_PUBLIC_API_URL

# Check if port 5090 is in use
lsof -i :5090  # macOS/Linux
netstat -ano | findstr :5090  # Windows

# Kill process on port 5090
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Restart Next.js dev server
# Ctrl+C to stop, then:
npm run dev

# View frontend logs in real-time
npm run dev 2>&1 | grep -i error
```

---

## When All Else Fails

1. [ ] Completely restart both frontend and backend
2. [ ] Clear browser cache and cookies
3. [ ] Delete node_modules and reinstall: `rm -rf node_modules && npm install`
4. [ ] Check firewall isn't blocking ports
5. [ ] Test with a different browser
6. [ ] Check .NET framework version compatibility
7. [ ] Review error logs in both frontend and backend
8. [ ] Verify database schema is up to date
9. [ ] Check for updates to dependencies
10. [ ] If stuck, capture all error messages and share with team
