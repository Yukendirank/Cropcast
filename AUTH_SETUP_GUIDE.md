# CropCast Authentication Setup Guide

## Quick Start

### 1. Frontend Setup

The frontend is already configured and ready to use. All authentication pages and utilities are in place.

### 2. Backend Endpoints Required

Your .NET backend needs the following endpoints for full functionality:

#### Existing Endpoints (Already Used)
```
POST /api/Auth/login
POST /api/Auth/register
GET /api/Auth/profile
PUT /api/Auth/profile
```

#### New Endpoints (Need Implementation)

**Forgot Password Endpoint**
```
POST /api/Auth/forgot-password
Request Body: { "email": "user@example.com" }
Response: { "success": true, "message": "Verification code sent to email" }
```

**Verify OTP Endpoint**
```
POST /api/Auth/verify-otp
Request Body: { "email": "user@example.com", "otp": "123456" }
Response: { "success": true, "message": "OTP verified successfully" }
```

**Reset Password Endpoint**
```
POST /api/Auth/reset-password
Request Body: { 
  "email": "user@example.com", 
  "otp": "123456", 
  "newPassword": "NewPassword123!" 
}
Response: { "success": true, "message": "Password reset successfully" }
```

### 3. OTP Implementation Details

**OTP Generation:**
- Generate random 6-digit code (000000-999999)
- Store in database with email and timestamp
- Set expiration to 10 minutes from creation
- Allow multiple OTP requests (mark old ones as invalidated)

**OTP Validation:**
- Check OTP matches email
- Verify OTP has not expired (10 minutes)
- Mark OTP as used after verification
- Only allow password reset if OTP was recently verified

**Email Delivery:**
- Configure SMTP server for sending emails
- Send OTP code in a clear, user-friendly email
- Include expiration time (10 minutes) in email

### 4. Testing the Authentication Flow

#### Test Signin
1. Go to `http://localhost:3000/signin`
2. Enter a registered user's email and password
3. Click "Sign In"
4. Should redirect to `/dashboard`
5. Token should be stored in localStorage

#### Test Registration
1. Go to `http://localhost:3000/get-started`
2. Fill out the form with new user details
3. Click "Create Account"
4. Should redirect to `/dashboard`
5. Token should be stored in localStorage

#### Test Password Reset (Requires Backend Implementation)
1. Go to `http://localhost:3000/forgot-password`
2. Enter registered user email
3. Click "Send Verification Code"
4. Should show success message and redirect to `/verify-otp`
5. Enter the 6-digit code sent to email
6. Click "Verify Code"
7. Should redirect to `/reset-password`
8. Enter new password (min 8 characters)
9. Click "Reset Password"
10. Should show success and redirect to `/signin`
11. Login with new password

#### Test Logout
1. When signed in, click "Sign Out" in navbar
2. Should redirect to home page
3. Token should be removed from localStorage

#### Test Protected Routes
1. Clear localStorage (or use private/incognito)
2. Try to access `http://localhost:3000/dashboard`
3. Should redirect to `/signin`
4. Sign in to access dashboard

#### Test Guest Access
1. Clear localStorage (or use private/incognito)
2. Visit `/features` - should show soft login prompt but be fully accessible
3. Visit `/predict` - should show soft login prompt but be fully accessible
4. Visit `/` - should work without login
5. Click "Sign In" in navbar soft prompt
6. Should redirect to signin page

### 5. Frontend Configuration

The frontend is configured to hit the backend at:
```
http://localhost:5000/api/Auth
```

To change this in production, edit `lib/auth.ts`:
```typescript
const BASE_URL = "http://your-production-api.com/api/Auth";
```

### 6. Browser Storage

**localStorage** stores:
- `token` - JWT token for authentication

Clear localStorage to simulate logout or use browser DevTools:
```javascript
// In browser console
localStorage.removeItem('token');
```

### 7. Authentication State Management

The app determines authentication state by:
1. Checking if `token` exists in localStorage
2. Using `auth.isAuthenticated()` utility function
3. Protecting routes based on token presence

Example usage in components:
```typescript
const isAuthenticated = auth.isAuthenticated();
const token = auth.getToken();

// Logout
auth.logout();

// Login (automatically called by signin/register)
auth.setToken(data.token);
```

### 8. Error Handling

All authentication forms display user-friendly error messages:
- Invalid credentials
- Network errors
- Server errors
- Form validation errors
- OTP expiration
- Password mismatch

### 9. Mobile Responsiveness

All authentication pages and flows are responsive:
- Mobile-friendly layouts
- Touch-friendly inputs
- Readable error messages on small screens
- Proper spacing and sizing

### 10. Styling and Branding

All authentication pages use the CropCast brand:
- Primary color: `#0A4D3C` (dark green)
- Hover color: `#083D2F` (darker green)
- Consistent with existing CropCast design
- Professional, modern appearance

## Troubleshooting

### Issue: Signin redirect not working
- Check that backend is running on `http://localhost:5000`
- Check that `/api/Auth/login` endpoint is accessible
- Check browser console for network errors
- Verify response includes `token` field

### Issue: Protected route not redirecting
- Check localStorage has `token` key
- Check token format is a valid JWT
- Try clearing localStorage and try again
- Check browser console for errors

### Issue: Password reset flow not working
- Ensure backend endpoints are implemented
- Check SMTP configuration for email delivery
- Verify OTP table/storage is configured
- Test email delivery separately

### Issue: Logout not working
- Check `auth.logout()` is removing token from localStorage
- Clear localStorage manually: `localStorage.removeItem('token')`
- Check navbar shows correct state after logout

### Issue: Soft login prompts not showing
- Check component is using `auth.isAuthenticated()`
- Verify useEffect is running after component mount
- Check token is properly stored in localStorage

## Backend Implementation Example (C# .NET)

```csharp
// In your Auth controller
[HttpPost("forgot-password")]
public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
{
    var user = await _userService.FindByEmailAsync(request.Email);
    if (user == null)
        return BadRequest(new { message = "User not found" });
    
    var otp = GenerateOtp(); // Generate 6-digit code
    var expiresAt = DateTime.UtcNow.AddMinutes(10);
    
    // Store OTP
    await _otpService.CreateAsync(new OtpEntity {
        Email = request.Email,
        Code = otp,
        ExpiresAt = expiresAt
    });
    
    // Send email
    await _emailService.SendOtpAsync(request.Email, otp);
    
    return Ok(new { success = true, message = "Verification code sent" });
}

[HttpPost("verify-otp")]
public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest request)
{
    var otp = await _otpService.FindAsync(request.Email, request.Otp);
    if (otp == null || otp.ExpiresAt < DateTime.UtcNow)
        return BadRequest(new { message = "Invalid or expired code" });
    
    // Mark as verified
    otp.IsVerified = true;
    await _otpService.UpdateAsync(otp);
    
    return Ok(new { success = true, message = "OTP verified" });
}

[HttpPost("reset-password")]
public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
{
    var otp = await _otpService.FindAsync(request.Email, request.Otp);
    if (otp == null || !otp.IsVerified || otp.ExpiresAt < DateTime.UtcNow)
        return BadRequest(new { message = "Invalid or expired verification" });
    
    var user = await _userService.FindByEmailAsync(request.Email);
    user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
    await _userService.UpdateAsync(user);
    
    // Clean up OTP
    await _otpService.DeleteAsync(otp.Id);
    
    return Ok(new { success = true, message = "Password reset successfully" });
}
```

## Production Checklist

- [ ] Backend endpoints implemented and tested
- [ ] SMTP configured for email delivery
- [ ] OTP database table created
- [ ] API URL updated in `lib/auth.ts`
- [ ] HTTPS enforced
- [ ] CORS headers configured
- [ ] Rate limiting implemented
- [ ] Error logging configured
- [ ] Database backups in place
- [ ] Security headers added
- [ ] Load testing completed
- [ ] User acceptance testing done

## Support

For issues or questions about the authentication implementation:
1. Check the IMPLEMENTATION_SUMMARY.md for detailed info
2. Review browser console for errors
3. Check network tab for API responses
4. Verify backend endpoints are running
5. Check error messages for specific guidance
