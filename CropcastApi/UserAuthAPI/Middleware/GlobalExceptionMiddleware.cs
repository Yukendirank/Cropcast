using System.Text.Json;

namespace UserAuthAPI.Middleware;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate                      _next;
    private readonly ILogger<GlobalExceptionMiddleware>   _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next   = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning("Unauthorized: {Message}", ex.Message);
            await WriteError(context, 401, ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("Bad request: {Message}", ex.Message);
            await WriteError(context, 400, ex.Message);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning("Not found: {Message}", ex.Message);
            await WriteError(context, 404, ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled server error");
            await WriteError(context, 500, "An unexpected error occurred. Please try again later.");
        }
    }

    private static async Task WriteError(HttpContext context, int statusCode, string message)
    {
        context.Response.StatusCode  = statusCode;
        context.Response.ContentType = "application/json";

        var body = JsonSerializer.Serialize(
            new { message },
            new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }
        );

        await context.Response.WriteAsync(body);
    }
}
