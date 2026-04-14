using MailKit.Net.Smtp;
using MimeKit;

namespace UserAuthAPI.Services;

public interface IEmailService
{
    Task SendPasswordResetEmailAsync(string toEmail, string resetToken);
}

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration config, ILogger<EmailService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task SendPasswordResetEmailAsync(string toEmail, string resetToken)
    {
        var baseUrl   = _config["App:BaseUrl"] ?? "http://localhost:3000";
        var resetLink = $"{baseUrl}/reset-password?token={resetToken}&email={Uri.EscapeDataString(toEmail)}";

        // ── DEV MODE: no SMTP configured → print to console ───────────────────
        var smtpHost     = _config["Email:Host"];
        var smtpUsername = _config["Email:Username"];
        var smtpPassword = _config["Email:Password"];

        bool smtpNotConfigured =
            string.IsNullOrWhiteSpace(smtpHost) ||
            string.IsNullOrWhiteSpace(smtpUsername) ||
            string.IsNullOrWhiteSpace(smtpPassword) ||
            smtpPassword == "your-app-password" ||
            smtpUsername == "your-email@gmail.com";

        if (smtpNotConfigured)
        {
            _logger.LogWarning("SMTP not configured. Printing reset link to console (DEV MODE).");
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("╔══════════════════════════════════════════════════╗");
            Console.WriteLine("║      PASSWORD RESET LINK  (DEV MODE)             ║");
            Console.WriteLine("╠══════════════════════════════════════════════════╣");
            Console.WriteLine($"║  To:    {toEmail}");
            Console.WriteLine($"║  Token: {resetToken}");
            Console.WriteLine($"║  Link:  {resetLink}");
            Console.WriteLine("╚══════════════════════════════════════════════════╝");
            Console.ResetColor();
            return;
        }

        // ── PRODUCTION: send real email via SMTP ──────────────────────────────
        var email = new MimeMessage();
        email.From.Add(MailboxAddress.Parse(_config["Email:From"]));
        email.To.Add(MailboxAddress.Parse(toEmail));
        email.Subject = "Password Reset Request";

        var bodyBuilder = new BodyBuilder
        {
            HtmlBody = $@"
<!DOCTYPE html>
<html>
<body style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
  <h2 style='color: #333;'>Password Reset Request</h2>
  <p>You requested a password reset for your account.</p>
  <p>Click the button below to reset your password. This link expires in <strong>1 hour</strong>.</p>
  <a href='{resetLink}'
     style='display:inline-block;padding:12px 24px;background:#4F46E5;color:#fff;
            text-decoration:none;border-radius:6px;font-weight:bold;'>
    Reset Password
  </a>
  <p style='color:#888;font-size:12px;margin-top:24px;'>
    If you did not request this, please ignore this email. Your password will not change.
  </p>
</body>
</html>"
        };
        email.Body = bodyBuilder.ToMessageBody();

        using var smtp = new SmtpClient();
        await smtp.ConnectAsync(smtpHost, int.Parse(_config["Email:Port"] ?? "587"),
            MailKit.Security.SecureSocketOptions.StartTls);
        await smtp.AuthenticateAsync(smtpUsername, smtpPassword);
        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);

        _logger.LogInformation("Password reset email sent to {Email}", toEmail);
    }
}
