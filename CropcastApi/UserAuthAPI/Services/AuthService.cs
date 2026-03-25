using Microsoft.EntityFrameworkCore;
using UserAuthAPI.Data;
using UserAuthAPI.DTOs;
using UserAuthAPI.Helpers;
using UserAuthAPI.Models;

namespace UserAuthAPI.Services;

public interface IAuthService
{
    Task<AuthResponseDto>          RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto>          LoginAsync(LoginDto dto);
    Task<ForgotPasswordResponseDto> ForgotPasswordAsync(ForgotPasswordDto dto);
    Task                           ResetPasswordAsync(ResetPasswordDto dto);
    Task<UserResponseDto>          GetProfileAsync(int userId);
    Task<UserResponseDto>          UpdateProfileAsync(int userId, UpdateProfileDto dto);
}

public class AuthService : IAuthService
{
    private readonly AppDbContext          _db;
    private readonly JwtHelper             _jwt;
    private readonly IEmailService         _email;
    private readonly ILogger<AuthService>  _logger;

    public AuthService(AppDbContext db, JwtHelper jwt, IEmailService email, ILogger<AuthService> logger)
    {
        _db     = db;
        _jwt    = jwt;
        _email  = email;
        _logger = logger;
    }

    // ── Register ──────────────────────────────────────────────────────────────
    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        var emailLower = dto.Email.ToLower().Trim();

        if (await _db.Users.AnyAsync(u => u.Email == emailLower))
            throw new InvalidOperationException("This email is already registered.");

        var user = new User
        {
            FirstName    = dto.FirstName.Trim(),
            LastName     = dto.LastName.Trim(),
            Email        = emailLower,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Location     = dto.Location.Trim()
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        _logger.LogInformation("User registered: {Email}", user.Email);

        return new AuthResponseDto
        {
            Token = _jwt.GenerateToken(user),
            User  = MapToResponse(user)
        };
    }

    // ── Login ─────────────────────────────────────────────────────────────────
    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var emailLower = dto.Email.ToLower().Trim();
        var user       = await _db.Users.FirstOrDefaultAsync(u => u.Email == emailLower);

        // Always check hash to prevent timing attacks even when user not found
        var dummyHash = "$2a$11$dummyhashfortimingattackprevention.padding.here";
        var hash      = user?.PasswordHash ?? dummyHash;

        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, hash))
            throw new UnauthorizedAccessException("Invalid email or password.");

        if (!user.IsActive)
            throw new UnauthorizedAccessException("Your account has been deactivated. Please contact support.");

        _logger.LogInformation("User logged in: {Email}", user.Email);

        return new AuthResponseDto
        {
            Token = _jwt.GenerateToken(user),
            User  = MapToResponse(user)
        };
    }

    // ── Forgot Password ───────────────────────────────────────────────────────
    public async Task<ForgotPasswordResponseDto> ForgotPasswordAsync(ForgotPasswordDto dto)
    {
        var emailLower = dto.Email.ToLower().Trim();
        var user       = await _db.Users.FirstOrDefaultAsync(u => u.Email == emailLower);

        // Always return 200 so attackers can't enumerate registered emails
        if (user == null)
        {
            _logger.LogWarning("Forgot-password for unregistered email: {Email}", emailLower);
            return new ForgotPasswordResponseDto
            {
                Message = "If this email is registered, you will receive a reset link shortly."
            };
        }

        user.PasswordResetToken       = Guid.NewGuid().ToString("N");
        user.PasswordResetTokenExpiry = DateTime.UtcNow.AddHours(1);
        await _db.SaveChangesAsync();

        // Catch email errors gracefully — token is saved, user can still reset
        try
        {
            await _email.SendPasswordResetEmailAsync(user.Email, user.PasswordResetToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send reset email to {Email}", user.Email);
        }

        return new ForgotPasswordResponseDto
        {
            Message       = "If this email is registered, you will receive a reset link shortly.",
            DevResetToken = user.PasswordResetToken   // Remove in production
        };
    }

    // ── Reset Password ────────────────────────────────────────────────────────
    public async Task ResetPasswordAsync(ResetPasswordDto dto)
    {
        var emailLower = dto.Email.ToLower().Trim();

        var user = await _db.Users.FirstOrDefaultAsync(u =>
            u.Email                   == emailLower         &&
            u.PasswordResetToken      == dto.Token          &&
            u.PasswordResetTokenExpiry > DateTime.UtcNow);

        if (user == null)
            throw new InvalidOperationException("Reset token is invalid or has expired. Please request a new one.");

        user.PasswordHash             = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        user.PasswordResetToken       = null;
        user.PasswordResetTokenExpiry = null;
        await _db.SaveChangesAsync();

        _logger.LogInformation("Password reset successful for: {Email}", emailLower);
    }

    // ── Get Profile ───────────────────────────────────────────────────────────
    public async Task<UserResponseDto> GetProfileAsync(int userId)
    {
        var user = await _db.Users.FindAsync(userId)
            ?? throw new KeyNotFoundException("User not found.");

        return MapToResponse(user);
    }

    // ── Update Profile ────────────────────────────────────────────────────────
    public async Task<UserResponseDto> UpdateProfileAsync(int userId, UpdateProfileDto dto)
    {
        var user = await _db.Users.FindAsync(userId)
            ?? throw new KeyNotFoundException("User not found.");

        if (!string.IsNullOrWhiteSpace(dto.FirstName)) user.FirstName = dto.FirstName.Trim();
        if (!string.IsNullOrWhiteSpace(dto.LastName))  user.LastName  = dto.LastName.Trim();
        if (!string.IsNullOrWhiteSpace(dto.Location))  user.Location  = dto.Location.Trim();

        await _db.SaveChangesAsync();
        _logger.LogInformation("Profile updated for user ID: {UserId}", userId);

        return MapToResponse(user);
    }

    // ── Mapper ────────────────────────────────────────────────────────────────
    private static UserResponseDto MapToResponse(User user) => new()
    {
        Id        = user.Id,
        FirstName = user.FirstName,
        LastName  = user.LastName,
        Email     = user.Email,
        Location  = user.Location,
        CreatedAt = user.CreatedAt
    };
}
