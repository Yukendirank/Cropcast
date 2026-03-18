# CropCast .NET Backend Implementation Guide

This document provides complete .NET code examples for implementing the CropCast backend API.

## Project Structure

```
CropCast.API/
├── Program.cs                    # Main configuration
├── Controllers/
│   ├── AuthController.cs         # Authentication endpoints
│   └── CropController.cs         # Crop prediction endpoints
├── Models/
│   ├── LoginRequest.cs
│   ├── RegisterRequest.cs
│   ├── CropPredictionRequest.cs
│   ├── PredictionResponse.cs
│   └── User.cs
├── Services/
│   ├── AuthService.cs            # JWT token generation
│   ├── CropPredictionService.cs  # ML prediction logic
│   └── JwtService.cs             # JWT utilities
├── Database/
│   └── AppDbContext.cs           # EF Core context
└── appsettings.json              # Configuration
```

## 1. Program.cs - Complete Setup

```csharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using CropCast.API.Services;
using CropCast.API.Database;

var builder = WebApplicationBuilder.CreateBuilder(args);

// Configure Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database Configuration
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS Configuration - MUST come before auth
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",      // Local development
            "http://localhost:3001",      // Alternative port
            "https://yourdomain.com"      // Production domain
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});

// JWT Authentication
var jwtSecret = builder.Configuration["Jwt:Secret"] ?? 
    throw new InvalidOperationException("JWT:Secret not configured");
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "CropCast";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "CropCastUsers";

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
            ValidIssuer = jwtIssuer,
            ValidateAudience = true,
            ValidAudience = jwtAudience,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero,
        };
    });

builder.Services.AddAuthorization();

// Custom Services
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<CropPredictionService>();

var app = builder.Build();

// Middleware Pipeline - Order matters!
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// CORS must come BEFORE Authentication/Authorization
app.UseCors("AllowLocalhost");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Health check endpoint
app.MapGet("/api/health", () => Results.Ok(new { status = "healthy" }));

app.Run();
```

## 2. appsettings.json Configuration

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  },
  "AllowedHosts": "*",
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

## 3. Models

### User.cs
```csharp
namespace CropCast.API.Models;

public class User
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Email { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    public ICollection<Prediction> Predictions { get; set; } = [];
}

public class Prediction
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string UserId { get; set; } = null!;
    public User User { get; set; } = null!;
    public decimal PredictedYieldKgPerHectare { get; set; }
    public double ConfidenceScore { get; set; }
    public string? Recommendations { get; set; }
    public string? RiskFactors { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
```

### LoginRequest.cs & RegisterRequest.cs
```csharp
namespace CropCast.API.Models;

public class LoginRequest
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
}

public class RegisterRequest
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string Name { get; set; } = null!;
}

public class AuthResponse
{
    public string Token { get; set; } = null!;
    public UserDto User { get; set; } = null!;
}

public class UserDto
{
    public string Id { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Name { get; set; } = null!;
}
```

### CropPredictionRequest.cs & PredictionResponse.cs
```csharp
namespace CropCast.API.Models;

public class CropPredictionRequest
{
    public double Rainfall { get; set; }
    public double Temperature { get; set; }
    public double Humidity { get; set; }
    public string SoilType { get; set; } = null!;
    public double SoilPh { get; set; }
    public string FertilizerUse { get; set; } = null!;
    public string Irrigation { get; set; } = null!;
    public bool PestControl { get; set; }
    public string CropVariety { get; set; } = null!;
    public bool DiseasePresence { get; set; }
}

public class PredictionResponse
{
    public decimal PredictedYieldKgPerHectare { get; set; }
    public double ConfidenceScore { get; set; }
    public string ModelUsed { get; set; } = ".NET Agricultural Model";
    public int FactorsAnalyzed { get; set; } = 10;
    public List<string> Recommendations { get; set; } = [];
    public List<string> RiskFactors { get; set; } = [];
}
```

## 4. Services

### JwtService.cs
```csharp
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace CropCast.API.Services;

public class JwtService
{
    private readonly IConfiguration _configuration;

    public JwtService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateToken(string userId, string email)
    {
        var secret = _configuration["Jwt:Secret"] ?? throw new InvalidOperationException();
        var issuer = _configuration["Jwt:Issuer"];
        var audience = _configuration["Jwt:Audience"];
        var expiryMinutes = int.Parse(_configuration["Jwt:ExpiryMinutes"] ?? "1440");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId),
            new Claim(ClaimTypes.Email, email),
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
```

### AuthService.cs
```csharp
using CropCast.API.Database;
using CropCast.API.Models;
using Microsoft.AspNetCore.Identity;

namespace CropCast.API.Services;

public class AuthService
{
    private readonly AppDbContext _context;
    private readonly JwtService _jwtService;

    public AuthService(AppDbContext context, JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        // Check if email exists
        if (_context.Users.Any(u => u.Email == request.Email))
            throw new InvalidOperationException("Email already registered");

        // Hash password
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        var user = new User
        {
            Email = request.Email,
            Name = request.Name,
            PasswordHash = passwordHash
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Generate token
        var token = _jwtService.GenerateToken(user.Id, user.Email);

        return new AuthResponse
        {
            Token = token,
            User = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                Name = user.Name
            }
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = _context.Users.FirstOrDefault(u => u.Email == request.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new InvalidOperationException("Invalid credentials");

        var token = _jwtService.GenerateToken(user.Id, user.Email);

        return new AuthResponse
        {
            Token = token,
            User = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                Name = user.Name
            }
        };
    }

    public UserDto GetCurrentUser(string userId)
    {
        var user = _context.Users.FirstOrDefault(u => u.Id == userId)
            ?? throw new InvalidOperationException("User not found");

        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            Name = user.Name
        };
    }
}
```

### CropPredictionService.cs
```csharp
using CropCast.API.Models;

namespace CropCast.API.Services;

public class CropPredictionService
{
    public PredictionResponse PredictYield(CropPredictionRequest request)
    {
        // Base yield
        decimal baseyield = 2500;

        // Weather factors
        baseyield += (decimal)(request.Rainfall - 100) * 8;
        baseyield += (decimal)(25 - Math.Abs(request.Temperature - 25)) * 20;
        baseyield += (decimal)(request.Humidity - 50) * 5;

        // Soil factors
        if (request.SoilType == "loamy") baseyield += 500;
        else if (request.SoilType == "clay") baseyield += 200;
        else if (request.SoilType == "sandy") baseyield -= 200;

        baseyield += (decimal)(7 - Math.Abs(request.SoilPh - 6.5)) * 100;

        // Management factors
        if (request.FertilizerUse == "high") baseyield += 600;
        else if (request.FertilizerUse == "moderate") baseyield += 300;

        if (request.Irrigation == "drip") baseyield += 400;
        else if (request.Irrigation == "sprinkler") baseyield += 300;

        if (request.PestControl) baseyield += 200;
        if (request.DiseasePresence) baseyield -= 500;

        baseyield = Math.Max(baseyield, 800);

        var confidence = 0.75 + (Math.Random() * 0.15);

        return new PredictionResponse
        {
            PredictedYieldKgPerHectare = Math.Round(baseyield, 2),
            ConfidenceScore = confidence,
            Recommendations = new List<string>
            {
                "Monitor soil moisture regularly",
                "Apply fertilizer according to soil test results",
                "Implement pest management strategies"
            },
            RiskFactors = new List<string>
            {
                request.Temperature > 35 ? "High temperature risk" : "",
                request.DiseasePresence ? "Disease detected" : ""
            }.Where(r => !string.IsNullOrEmpty(r)).ToList()
        };
    }
}
```

## 5. Controllers

### AuthController.cs
```csharp
using CropCast.API.Models;
using CropCast.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CropCast.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        try
        {
            var response = await _authService.RegisterAsync(request);
            return Ok(response);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        try
        {
            var response = await _authService.LoginAsync(request);
            return Ok(response);
        }
        catch (InvalidOperationException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpGet("me")]
    [Authorize]
    public ActionResult<UserDto> GetCurrentUser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var user = _authService.GetCurrentUser(userId);
        return Ok(user);
    }
}
```

### CropController.cs
```csharp
using CropCast.API.Models;
using CropCast.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CropCast.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CropController : ControllerBase
{
    private readonly CropPredictionService _predictionService;

    public CropController(CropPredictionService predictionService)
    {
        _predictionService = predictionService;
    }

    [HttpPost("predict")]
    public ActionResult<PredictionResponse> Predict(CropPredictionRequest request)
    {
        var prediction = _predictionService.PredictYield(request);
        return Ok(prediction);
    }

    [HttpGet("predictions")]
    public ActionResult<List<Prediction>> GetUserPredictions()
    {
        // Implement to return user's prediction history
        return Ok(new List<Prediction>());
    }
}
```

## 6. Database Context

### AppDbContext.cs
```csharp
using CropCast.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CropCast.API.Database;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Prediction> Predictions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>()
            .HasKey(u => u.Id);
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // Prediction configuration
        modelBuilder.Entity<Prediction>()
            .HasKey(p => p.Id);
        modelBuilder.Entity<Prediction>()
            .HasOne(p => p.User)
            .WithMany(u => u.Predictions)
            .HasForeignKey(p => p.UserId);
    }
}
```

## 7. NuGet Packages Required

```bash
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package BCrypt.Net-Core
```

## 8. Running the Backend

```bash
# Create database
dotnet ef database update

# Run development server
dotnet run

# Backend will be available at http://localhost:5090
```

## Testing with cURL

```bash
# Register
curl -X POST http://localhost:5090/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password","name":"Test User"}'

# Login
curl -X POST http://localhost:5090/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Predict (with token)
curl -X POST http://localhost:5090/api/crop/predict \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"rainfall":120,"temperature":28,"humidity":65,...}'
```

## Common Issues

### CORS Not Working
- Ensure `UseCors()` comes BEFORE `UseAuthentication()`
- Verify origin matches exactly (no trailing slash)
- Check `AllowCredentials()` is set for cookie auth

### JWT Invalid
- Ensure secret is same in backend and frontend
- Check token expiry time
- Verify issuer and audience match

### Database Connection Failed
- Verify SQL Server is running
- Check connection string in appsettings.json
- Ensure database exists or run migrations
