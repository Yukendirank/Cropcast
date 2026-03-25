# UserAuthAPI — .NET 8 Authentication Backend

## 📁 Folder Structure
```
UserAuthAPI/
├── Controllers/
│   └── AuthController.cs          # All API endpoints
├── Data/
│   └── AppDbContext.cs             # EF Core DB context
├── DTOs/
│   └── AuthDtos.cs                 # Request / Response models
├── Helpers/
│   └── JwtHelper.cs                # JWT token generator
├── Middleware/
│   └── GlobalExceptionMiddleware.cs # Clean JSON error responses
├── Migrations/                     # EF auto-generated (don't edit)
├── Models/
│   └── User.cs                     # User entity
├── Services/
│   ├── AuthService.cs              # Business logic
│   └── EmailService.cs             # SMTP email (dev: prints to console)
├── appsettings.json                # Config — update SQL Server + SMTP
├── appsettings.Development.json
├── Program.cs                      # DI setup & middleware pipeline
└── UserAuthAPI.csproj
```

---

## 🚀 Setup & Run

### 1. Restore packages
```bash
dotnet restore
```

### 2. Install EF Tools (one-time)
```bash
dotnet tool install --global dotnet-ef
```

### 3. Create migration & apply to DB
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### 4. Run
```bash
dotnet run
```

Swagger UI → **http://localhost:5000/swagger**

---

## 📡 API Endpoints

| Method | Endpoint                    | Auth  | Description                      |
|--------|-----------------------------|:-----:|----------------------------------|
| POST   | `/api/Auth/register`        | ❌    | Create account                    |
| POST   | `/api/Auth/login`           | ❌    | Login → returns JWT token         |
| POST   | `/api/Auth/forgot-password` | ❌    | Send reset email (dev: console)   |
| POST   | `/api/Auth/reset-password`  | ❌    | Reset with token                  |
| GET    | `/api/Auth/profile`         | ✅ JWT | Get my profile                   |
| PUT    | `/api/Auth/profile`         | ✅ JWT | Update firstName/lastName/location|

---

## 🔐 How to test protected endpoints in Swagger

1. Call **POST /api/Auth/register** or **POST /api/Auth/login**
2. Copy the `token` value from the JSON response (the long `eyJ...` string)
3. Click the 🔒 **Authorize** button at the top of Swagger
4. In the **Value** box type exactly: `Bearer eyJhbGci...` (paste your token)
5. Click **Authorize** → **Close**
6. Now **GET /api/Auth/profile** will return 200 ✅

---

## 🔑 Forgot Password (dev without SMTP)

1. Call **POST /api/Auth/forgot-password** with your email
2. Look at the terminal — you will see the reset token printed in yellow
3. The response also contains `devResetToken`
4. Use that token in **POST /api/Auth/reset-password**

---

## ✉️ Configure Real Email (Gmail)

1. Enable 2FA on your Gmail account
2. Go to Google Account → Security → App Passwords
3. Create an App Password for "Mail"
4. Update `appsettings.json`:
```json
"Email": {
  "Host": "smtp.gmail.com",
  "Port": "587",
  "Username": "yourname@gmail.com",
  "Password": "xxxx xxxx xxxx xxxx",
  "From": "yourname@gmail.com"
}
```

---

## 🧪 curl Examples

```bash
# Register
curl -X POST http://localhost:5000/api/Auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@test.com","password":"Pass123!","location":"New York"}'

# Login
curl -X POST http://localhost:5000/api/Auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"Pass123!"}'

# Get Profile (replace TOKEN)
curl http://localhost:5000/api/Auth/profile \
  -H "Authorization: Bearer TOKEN"

# Forgot Password
curl -X POST http://localhost:5000/api/Auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com"}'

# Reset Password (use devResetToken from above)
curl -X POST http://localhost:5000/api/Auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","token":"RESET_TOKEN","newPassword":"NewPass456!"}'
```

---

## 🗄️ DB Commands Reference

```bash
dotnet ef migrations add <Name>   # create new migration
dotnet ef database update          # apply to DB
dotnet ef migrations remove        # undo last migration
dotnet ef database drop            # delete DB (careful!)
```
