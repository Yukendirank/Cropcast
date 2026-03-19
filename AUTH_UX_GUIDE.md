# CropCast Authentication UX Guide

## Overview

CropCast implements a modern SaaS authentication experience that balances security with user experience. Key features include guest access to core features, soft login prompts, and a complete password recovery flow.

---

## Route Access Structure

### Public Routes (Guest Access Allowed)

These routes allow users to explore and use features without authentication:

- **`/`** - Home page
- **`/features`** - Feature showcase (all 5 feature cards)
- **`/predict`** - Crop prediction tool (guests can make predictions, cannot save)
- **`/chat`** - AI Assistant chatbot
- **`/weather`** (if implemented) - Weather insights
- **`/signin`** - Sign in page
- **`/get-started`** - Registration page
- **`/forgot-password`** - Password recovery flow
- **`/verify-otp`** - OTP verification
- **`/reset-password`** - New password creation

### Protected Routes (Login Required)

These routes require authentication:

- **`/dashboard`** - User analytics and statistics (displays "Login to save results")
- **`/predictions`** - Prediction history and saved results

---

## Navigation Structure

### Header Navigation

The main navigation bar includes:

```
Home → Features → Predict Yield → Dashboard
                                    Sign In (button)
                                    Get Started (button)
```

Button Behavior:
- **Sign In** → Routes to `/signin`
- **Get Started** → Routes to `/get-started`

---

## User Flows

### Flow 1: Guest Using Prediction Tool

1. User clicks "Get Started" or "Predict Yield" in navbar
2. Lands on `/predict` page (guest accessible)
3. Fills form and gets prediction
4. If not logged in: "Login to save your results" prompt shown
5. User can either continue as guest or click prompt to login

### Flow 2: New User Signup

1. User clicks "Get Started" button in header
2. Routes to `/get-started` page
3. Fills registration form (name, email, password)
4. Backend creates account and returns JWT token
5. User is auto-logged in, redirected to `/dashboard`

### Flow 3: Existing User Login

1. User clicks "Sign In" button in header
2. Routes to `/signin` page
3. Enters email and password
4. Sees "Forgot Password?" link below password field
5. Successfully logs in, redirected to `/dashboard`

### Flow 4: Password Recovery

1. User at `/signin` page clicks "Forgot Password?"
2. Redirected to `/forgot-password`
3. Enters email address
4. Backend sends 6-digit OTP via SMTP email
5. Redirected to `/verify-otp` page
6. User enters OTP code (expires in 5-10 minutes)
7. Redirected to `/reset-password` page
8. User sets new password
9. Success message and redirect to `/signin`

---

## Component Structure

### Header Component
- Logo + "CropCast" brand
- Navigation links: Home, Features, Predict Yield, Dashboard
- Auth buttons: Sign In, Get Started
- Mobile menu toggle

### Login Form (`LoginForm`)
- Email input with validation
- Password input with validation
- "Forgot Password?" link
- Login button
- Register redirect link
- Error/success toast notifications

### Registration Form (`RegisterForm`)
- Name input
- Email input
- Password input
- Confirm password input
- Validation for password match
- Sign in redirect link

### Forgot Password Forms
1. **ForgotPasswordForm** - Email entry, OTP sent
2. **VerifyOtpForm** - 6-digit OTP entry, 10 min timer
3. **ResetPasswordForm** - New password entry with validation

---

## Authentication Logic

### Auth Context (`lib/auth-context.tsx`)

Manages global auth state:

```typescript
interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  error: string | null
}
```

### Protected Route Component

Conditionally renders routes:
- Checks `isAuthenticated` status
- Shows loading skeleton while verifying
- Redirects to `/signin` if not authenticated
- Only used on `/dashboard` and `/predictions`

### API Client (`lib/api-client.ts`)

- Stores JWT token in localStorage
- Auto-injects token in request headers
- Handles token expiration and refresh
- Clears token on logout

---

## Backend Requirements

### Authentication Endpoints

#### 1. Register
```
POST /api/auth/register
Body: { email, password, name }
Response: { token, user: { id, email, name } }
```

#### 2. Login
```
POST /api/auth/login
Body: { email, password }
Response: { token, user: { id, email, name } }
```

#### 3. Get Current User
```
GET /api/auth/me
Headers: { Authorization: "Bearer {token}" }
Response: { user: { id, email, name } }
```

#### 4. Forgot Password
```
POST /api/auth/forgot-password
Body: { email }
Response: { message: "OTP sent to email" }
```

#### 5. Verify OTP
```
POST /api/auth/verify-otp
Body: { email, otp }
Response: { token } (temporary token for password reset)
```

#### 6. Reset Password
```
POST /api/auth/reset-password
Body: { token, newPassword }
Response: { message: "Password reset successful" }
```

### Database Schema for OTP

```sql
CREATE TABLE otp_tokens (
  id GUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  otp_code VARCHAR(6) NOT NULL,
  created_at DATETIME NOT NULL,
  expires_at DATETIME NOT NULL,
  used BOOLEAN DEFAULT FALSE
);
```

### SMTP Email Configuration

Required for OTP delivery:
- SMTP server credentials
- From email address
- Email templates for OTP

Example email template:
```
Subject: Your CropCast Password Reset Code

Hello [User Name],

Your password reset code is: [6-DIGIT-OTP]

This code expires in 10 minutes.

If you didn't request this, please ignore this email.

Best regards,
CropCast Team
```

---

## User Experience Highlights

### Soft Login Prompts

Instead of blocking users from features, CropCast shows:
- "Login to save your results" after predictions
- "Create an account to keep your history" on dashboard
- Results are still visible, but not persisted

### Security

- JWT tokens stored securely
- Passwords hashed with bcrypt
- OTP expires after 10 minutes
- Only 3 OTP attempts allowed before lockout

### Accessibility

- All forms have proper labels
- Error messages are clear and actionable
- Loading states shown during async operations
- Keyboard navigation support
- Dark mode support

---

## Environment Variables

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5090

# Email/SMTP (for .NET backend)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=noreply@cropcast.com
```

---

## Testing the Auth Flow

1. **Test Guest Access**
   - Navigate to `/predict` without logging in
   - Make a prediction
   - Verify "Login to save" message appears

2. **Test Registration**
   - Click "Get Started"
   - Fill form with new email
   - Verify redirect to `/dashboard`

3. **Test Login**
   - Logout if needed
   - Click "Sign In"
   - Enter credentials
   - Verify redirect to `/dashboard`

4. **Test Password Recovery**
   - At `/signin`, click "Forgot Password?"
   - Enter email
   - Check email for OTP code
   - Enter OTP
   - Set new password
   - Login with new password

---

## Troubleshooting

### Users can't reset password
- Check SMTP credentials in .NET backend
- Verify email is registered in database
- Check OTP table for expired entries

### Protected routes redirect unexpectedly
- Verify JWT token is stored in localStorage
- Check token hasn't expired
- Verify backend auth endpoints return valid tokens

### Guest predictions not saving
- This is intentional - only authenticated users can save
- Show "Login to save" message clearly
- Provide easy link to registration

---

## Future Enhancements

- OAuth/Social login (Google, GitHub)
- Two-factor authentication
- Password strength meter
- Session management (logout from all devices)
- Remember me functionality
- Account recovery with backup codes
