# CORS Configuration Guide for CropCast Backend

This guide explains how to configure CORS (Cross-Origin Resource Sharing) in your .NET backend to allow your Next.js frontend to communicate with it.

---

## What is CORS?

CORS is a security feature that controls which websites can make requests to your API. Without proper CORS configuration, browsers block cross-origin requests with a security error.

**Cross-Origin Example:**
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5090`
- These are different origins (different ports), so CORS is needed

---

## The CORS Problem

When your frontend tries to call the backend without CORS:

```
Browser makes request → Backend receives it → Backend responds
                     → Browser blocks response (CORS error!)
```

**Error Message You'll See:**
```
Access to XMLHttpRequest at 'http://localhost:5090/api/auth/login' 
from origin 'http://localhost:3000' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check
```

---

## The Solution: Configure CORS in Program.cs

### Minimal Configuration (Development)

```csharp
var builder = WebApplicationBuilder.CreateBuilder(args);

// Add CORS service
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Use CORS middleware BEFORE authentication
app.UseCors("AllowLocalhost");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
```

### Production Configuration

```csharp
var builder = WebApplicationBuilder.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowProduction", policy =>
    {
        policy.WithOrigins(
            "https://yourdomain.com",
            "https://www.yourdomain.com"
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();  // Important for cookies/auth
    });
});

var app = builder.Build();

app.UseCors("AllowProduction");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
```

### Development + Production Configuration

```csharp
var builder = WebApplicationBuilder.CreateBuilder(args);

// Read allowed origins from configuration
var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? [];

builder.Services.AddCors(options =>
{
    options.AddPolicy("CropCastPolicy", policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            // Allow all in development
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        }
        else
        {
            // Strict in production
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
        }
    });
});

var app = builder.Build();

app.UseCors("CropCastPolicy");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
```

---

## appsettings.json Configuration

### Development (appsettings.Development.json)

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning"
    }
  },
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:3001"
    ]
  }
}
```

### Production (appsettings.json)

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  },
  "Cors": {
    "AllowedOrigins": [
      "https://yourdomain.com",
      "https://www.yourdomain.com",
      "https://app.yourdomain.com"
    ]
  }
}
```

---

## Middleware Order is Critical!

The order of middleware in `Program.cs` matters. CORS MUST come before auth:

### ✅ CORRECT Order
```csharp
app.UseCors("AllowLocalhost");      // 1. CORS first
app.UseAuthentication();              // 2. Then authentication
app.UseAuthorization();               // 3. Then authorization
app.MapControllers();                 // 4. Finally routes
```

### ❌ WRONG Order
```csharp
app.UseAuthentication();              // ❌ Auth before CORS
app.UseCors("AllowLocalhost");       // ❌ CORS after auth
app.UseAuthorization();
app.MapControllers();
```

---

## CORS Configuration Options Explained

### WithOrigins() - Specify Allowed Domains
```csharp
policy.WithOrigins(
    "http://localhost:3000",     // Exact match required
    "https://yourdomain.com",    // No trailing slashes!
    "https://app.yourdomain.com" // Include all subdomains explicitly
)
```

**Important:** Origin must match exactly (protocol + domain + port)
- `http://localhost:3000` ≠ `http://localhost:3000/` (trailing slash fails!)
- `http://localhost:3000` ≠ `https://localhost:3000` (different protocol)
- `http://localhost:3000` ≠ `http://localhost:3001` (different port)

### AllowAnyOrigin() - Allow All (Development Only!)
```csharp
policy.AllowAnyOrigin()  // Dangerous in production!
```

**Use only in development.** Never in production.

### AllowAnyMethod() - Allow All HTTP Methods
```csharp
policy.AllowAnyMethod()  // Allows GET, POST, PUT, DELETE, PATCH, OPTIONS
```

### AllowAnyHeader() - Allow All Headers
```csharp
policy.AllowAnyHeader()  // Allows any request header
```

### AllowCredentials() - Allow Cookies/Auth
```csharp
policy.AllowCredentials()  // Required for JWT in Authorization header
```

### WithMethods() - Specific Methods Only
```csharp
policy.WithMethods("GET", "POST", "OPTIONS")  // Only these methods
```

### WithHeaders() - Specific Headers Only
```csharp
policy.WithHeaders("Content-Type", "Authorization")  // Only these headers
```

### WithExposedHeaders() - Expose Headers to Client
```csharp
policy.WithExposedHeaders("X-Total-Count", "X-Page-Count")
```

---

## Common CORS Configurations

### Configuration 1: Development (Maximum Permissive)
```csharp
// Allow any origin, method, header from anywhere
options.AddPolicy("DevPolicy", policy =>
{
    policy.AllowAnyOrigin()
          .AllowAnyMethod()
          .AllowAnyHeader();
});
```

### Configuration 2: Production (Strict)
```csharp
// Only allow your frontend domain with credentials
options.AddPolicy("ProdPolicy", policy =>
{
    policy.WithOrigins("https://yourdomain.com")
          .AllowAnyMethod()
          .AllowAnyHeader()
          .AllowCredentials();
});
```

### Configuration 3: Multiple Environments
```csharp
// Different origins for different environments
var isDev = builder.Environment.IsDevelopment();
var origins = isDev 
    ? new[] { "http://localhost:3000", "http://localhost:3001" }
    : new[] { "https://yourdomain.com", "https://app.yourdomain.com" };

options.AddPolicy("AppPolicy", policy =>
{
    policy.WithOrigins(origins)
          .AllowAnyMethod()
          .AllowAnyHeader()
          .AllowCredentials();
});
```

### Configuration 4: With Exposed Headers
```csharp
// For APIs that return custom headers
options.AddPolicy("HeaderPolicy", policy =>
{
    policy.WithOrigins("http://localhost:3000")
          .AllowAnyMethod()
          .WithHeaders("Content-Type", "Authorization")
          .WithExposedHeaders("X-Total-Count", "X-Page-Number");
});
```

---

## Preflight Requests (OPTIONS)

When making certain requests, browsers first send an OPTIONS request to check CORS:

### When Preflight Happens
- POST/PUT/PATCH requests
- Requests with custom headers (like `Authorization: Bearer`)
- Requests with certain content types

### Preflight Flow

```
Browser checks if request needs CORS
    ↓
Sends OPTIONS request to backend
    ↓
Backend responds with CORS headers
    ↓
Browser checks if request is allowed
    ↓
If allowed: Sends actual request
If denied: Blocks with CORS error
```

### Example Preflight Request

**Browser sends:**
```http
OPTIONS /api/auth/login HTTP/1.1
Host: localhost:5090
Origin: http://localhost:3000
Access-Control-Request-Method: POST
Access-Control-Request-Headers: content-type
```

**Backend must respond with:**
```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## Testing CORS Configuration

### Test 1: Health Check (Simple GET)
```bash
curl http://localhost:5090/api/health

# Should return 200 with JSON
```

### Test 2: Preflight Check (OPTIONS)
```bash
curl -i -X OPTIONS http://localhost:5090/api/auth/login \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type"

# Should return 200 with CORS headers
```

### Test 3: Full Login Request
```bash
curl -i http://localhost:5090/api/auth/login \
  -H "Origin: http://localhost:3000" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Should return 200 with token
# Response should include CORS headers
```

### Test 4: From Browser Console
```javascript
// Test CORS from actual browser
fetch('http://localhost:5090/api/health')
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error('CORS Error:', e.message))
```

---

## Troubleshooting CORS Issues

### Issue 1: "CORS policy blocked"
**Error:** `Access to XMLHttpRequest at '...' has been blocked by CORS policy`

**Solutions:**
1. [ ] Check `WithOrigins()` matches exactly (no trailing slash)
2. [ ] Verify `UseCors()` is BEFORE `UseAuthentication()`
3. [ ] Ensure CORS is added to services: `AddCors()`
4. [ ] Restart backend after changes
5. [ ] Clear browser cache: Ctrl+Shift+Delete

### Issue 2: "No CORS headers in response"
**Error:** Preflight returns 200 but missing CORS headers

**Solutions:**
1. [ ] Verify policy is being used: `app.UseCors("YourPolicyName")`
2. [ ] Check origin matches exactly
3. [ ] Ensure no route-level CORS is overriding it
4. [ ] Check application logs for warnings
5. [ ] Restart backend

### Issue 3: "OPTIONS returns 404"
**Error:** Preflight request returns 404 Not Found

**Solutions:**
1. [ ] Add route for OPTIONS: `options.AllowAnyMethod()`
2. [ ] Check endpoint exists at that path
3. [ ] Verify controller is mapped correctly
4. [ ] Restart backend

### Issue 4: "401 Unauthorized after CORS"
**Error:** Preflight succeeds but actual request returns 401

**Solutions:**
1. [ ] Add `AllowCredentials()` to CORS policy
2. [ ] Ensure token is being sent in Authorization header
3. [ ] Check token hasn't expired
4. [ ] Verify JWT secret in backend matches token
5. [ ] Check token is stored in localStorage

### Issue 5: Works in Postman but not in Browser
**Cause:** Postman doesn't enforce CORS

**Solution:**
1. [ ] Test with curl from terminal instead
2. [ ] Check browser console for actual error
3. [ ] Use browser DevTools Network tab to inspect responses
4. [ ] Verify CORS headers are present in response

---

## Production Deployment Checklist

- [ ] Replace localhost with your actual domain
- [ ] Set CORS origin to HTTPS (not HTTP)
- [ ] Include all subdomains that need access
- [ ] Set `AllowCredentials()` to true
- [ ] Use environment variables for origins
- [ ] Test CORS before deploying
- [ ] Monitor CORS errors in production
- [ ] Update CORS when deploying new domains

---

## CORS Security Best Practices

### ✅ DO:
- Specify exact origins (not AllowAnyOrigin in production)
- Use HTTPS in production
- Include credentials only when needed
- List origins in configuration files
- Restart application after CORS changes
- Test CORS configuration before deployment

### ❌ DON'T:
- Use `AllowAnyOrigin()` with `AllowCredentials()`
- Trust user input for origin validation
- Forget to restart backend after CORS changes
- Use AllowAnyOrigin in production
- Expose too many headers unnecessarily
- Mix wildcard origins with specific ones

---

## Sample Complete Program.cs

```csharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplicationBuilder.CreateBuilder(args);

// Add services
builder.Services.AddControllers();

// Add CORS
var corsOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? [];

builder.Services.AddCors(options =>
{
    options.AddPolicy("CropCastPolicy", policy =>
    {
        policy.WithOrigins(corsOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Add JWT Authentication
var jwtSecret = builder.Configuration["Jwt:Secret"] 
    ?? throw new InvalidOperationException("JWT:Secret not configured");

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSecret)),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
        };
    });

var app = builder.Build();

// Middleware order matters!
app.UseCors("CropCastPolicy");      // CORS first
app.UseAuthentication();             // Then auth
app.UseAuthorization();              // Then authorization

app.MapControllers();
app.Run();
```

---

## Related Documentation

- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Complete setup instructions
- [DEBUG_CHECKLIST.md](./DEBUG_CHECKLIST.md) - Debugging guide
- [BACKEND_IMPLEMENTATION.md](./BACKEND_IMPLEMENTATION.md) - Backend implementation details
