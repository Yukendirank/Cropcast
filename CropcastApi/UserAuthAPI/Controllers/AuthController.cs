using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserAuthAPI.DTOs;
using UserAuthAPI.Services;

namespace UserAuthAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    // ── POST /api/Auth/register ───────────────────────────────────────────────
    /// <summary>Create a new user account</summary>
    /// <response code="200">Returns JWT token and user details</response>
    /// <response code="400">Email already registered or validation failed</response>
    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponseDto), 200)]
    [ProducesResponseType(typeof(ApiErrorDto), 400)]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new ApiErrorDto
            {
                Message = "Validation failed.",
                Errors  = ModelState.ToDictionary(
                    k => k.Key,
                    v => v.Value!.Errors.Select(e => e.ErrorMessage).ToArray()
                )
            });

        var result = await _authService.RegisterAsync(dto);
        return Ok(result);
    }

    // ── POST /api/Auth/login ──────────────────────────────────────────────────
    /// <summary>Login and receive a JWT token</summary>
    /// <response code="200">Returns JWT token and user details</response>
    /// <response code="401">Invalid credentials</response>
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponseDto), 200)]
    [ProducesResponseType(typeof(ApiErrorDto), 401)]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new ApiErrorDto { Message = "Validation failed." });

        var result = await _authService.LoginAsync(dto);
        return Ok(result);
    }

    // ── POST /api/Auth/forgot-password ────────────────────────────────────────
    /// <summary>Request a password reset email</summary>
    /// <remarks>Always returns 200 to prevent email enumeration. In DEV mode the reset token is returned in the response body.</remarks>
    /// <response code="200">Reset email sent (or token shown in dev mode)</response>
    [HttpPost("forgot-password")]
    [ProducesResponseType(typeof(ForgotPasswordResponseDto), 200)]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new ApiErrorDto { Message = "Validation failed." });

        var result = await _authService.ForgotPasswordAsync(dto);
        return Ok(result);
    }

    // ── POST /api/Auth/reset-password ─────────────────────────────────────────
    /// <summary>Reset password using the token from the email (or devResetToken)</summary>
    /// <response code="200">Password reset successfully</response>
    /// <response code="400">Invalid or expired token</response>
    [HttpPost("reset-password")]
    [ProducesResponseType(200)]
    [ProducesResponseType(typeof(ApiErrorDto), 400)]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new ApiErrorDto { Message = "Validation failed." });

        await _authService.ResetPasswordAsync(dto);
        return Ok(new { message = "Password has been reset successfully. You can now log in." });
    }

    // ── GET /api/Auth/profile ─────────────────────────────────────────────────
    /// <summary>Get the authenticated user's profile</summary>
    /// <remarks>Requires: Authorization: Bearer {token}</remarks>
    /// <response code="200">User profile</response>
    /// <response code="401">Not authenticated — provide a valid JWT token</response>
    [HttpGet("profile")]
    [Authorize]
    [ProducesResponseType(typeof(UserResponseDto), 200)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> GetProfile()
    {
        var userId = GetUserId();
        var result = await _authService.GetProfileAsync(userId);
        return Ok(result);
    }

    // ── PUT /api/Auth/profile ─────────────────────────────────────────────────
    /// <summary>Update the authenticated user's profile (firstName, lastName, location)</summary>
    /// <remarks>Requires: Authorization: Bearer {token}</remarks>
    /// <response code="200">Updated user profile</response>
    /// <response code="401">Not authenticated — provide a valid JWT token</response>
    [HttpPut("profile")]
    [Authorize]
    [ProducesResponseType(typeof(UserResponseDto), 200)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
    {
        var userId = GetUserId();
        var result = await _authService.UpdateProfileAsync(userId, dto);
        return Ok(result);
    }

    // ── Helper ────────────────────────────────────────────────────────────────
    private int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
}
