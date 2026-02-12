import https from "https";

const SENDGRID_API_KEY = process.env.TWILIO_SENDGRID_API_KEY;
const FROM_EMAIL = "noreply@lynkhealthcare.com";
const FROM_NAME = "Lynk Health";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!SENDGRID_API_KEY) {
    console.error("[Email] TWILIO_SENDGRID_API_KEY not configured - cannot send email");
    console.log(`[Email] Would have sent to: ${options.to}, subject: ${options.subject}`);
    return false;
  }

  const payload = JSON.stringify({
    personalizations: [{ to: [{ email: options.to }] }],
    from: { email: FROM_EMAIL, name: FROM_NAME },
    subject: options.subject,
    content: [
      ...(options.text ? [{ type: "text/plain", value: options.text }] : []),
      { type: "text/html", value: options.html },
    ],
  });

  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: "api.sendgrid.com",
        path: "/v3/mail/send",
        method: "POST",
        headers: {
          Authorization: `Bearer ${SENDGRID_API_KEY}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`[Email] Sent successfully to ${options.to}`);
          resolve(true);
        } else {
          let body = "";
          res.on("data", (chunk) => (body += chunk));
          res.on("end", () => {
            console.error(`[Email] SendGrid error ${res.statusCode}: ${body}`);
            resolve(false);
          });
        }
      }
    );
    req.on("error", (err) => {
      console.error("[Email] Request error:", err.message);
      resolve(false);
    });
    req.write(payload);
    req.end();
  });
}

export function buildPasswordResetEmail(resetUrl: string, userName: string): EmailOptions & { to: string } {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #1e3a5f; font-size: 24px; margin: 0;">Lynk Health</h1>
  </div>
  <div style="background: #f8f9fa; border-radius: 8px; padding: 30px; margin-bottom: 20px;">
    <h2 style="margin-top: 0; color: #1e3a5f;">Password Reset Request</h2>
    <p>Hi ${userName},</p>
    <p>We received a request to reset your password. Click the button below to create a new password:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" style="background: #d4a017; color: #fff; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">Reset Password</a>
    </div>
    <p style="font-size: 14px; color: #666;">This link will expire in <strong>15 minutes</strong> for security purposes.</p>
    <p style="font-size: 14px; color: #666;">If you didn't request this reset, you can safely ignore this email. Your password will remain unchanged.</p>
  </div>
  <div style="text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 15px;">
    <p>This is an automated message from Lynk Health. Please do not reply.</p>
    <p>&copy; ${new Date().getFullYear()} Lynk Health. All rights reserved.</p>
  </div>
</body>
</html>`;

  const text = `Hi ${userName},\n\nWe received a request to reset your password. Visit this link to create a new password:\n\n${resetUrl}\n\nThis link will expire in 15 minutes.\n\nIf you didn't request this reset, you can safely ignore this email.\n\n- Lynk Health`;

  return { to: "", subject: "Lynk Health - Password Reset", html, text };
}
