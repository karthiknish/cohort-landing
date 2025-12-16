import * as fs from 'fs';
import * as path from 'path';

interface SendEmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

interface BrevoEmailPayload {
  sender: { name: string; email: string };
  to: { email: string; name: string }[];
  subject: string;
  htmlContent: string;
  attachment?: { content: string; name: string }[];
}

/**
 * Send brochure email via Brevo API
 */
export async function sendBrochureEmail(
  toEmail: string,
  toName: string
): Promise<SendEmailResponse> {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.error('BREVO_API_KEY is not configured');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    // Read the brochure PDF and convert to base64
    const brochurePath = path.join(process.cwd(), 'public', 'Brochure.pdf');
    const brochureBuffer = fs.readFileSync(brochurePath);
    const brochureBase64 = brochureBuffer.toString('base64');

    const emailPayload: BrevoEmailPayload = {
      sender: {
        name: 'Cohorts Team',
        email: 'noreply@cohorts.team',
      },
      to: [
        {
          email: toEmail,
          name: toName,
        },
      ],
      subject: 'Your Cohorts.team Brochure',
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Red Hat Display', Arial, sans-serif; margin: 0; padding: 40px 20px; background-color: #fffcf3;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 40px; border: 1px solid #001640/10;">
            <h1 style="color: #001640; font-size: 28px; margin-bottom: 20px;">Hi ${toName},</h1>
            
            <p style="color: #001640; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Thank you for your interest in <span style="color: #004aad;">Cohorts.team</span>!
            </p>
            
            <p style="color: #001640; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Please find attached our comprehensive brochure with everything you need to know about how we can help your business achieve more for less.
            </p>
            
            <p style="color: #001640; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              If you have any questions or would like to discuss how we can work together, feel free to reach out to us on <a href="https://www.linkedin.com/company/cohorts-team" style="color: #004aad;">LinkedIn</a>.
            </p>
            
            <p style="color: #001640; font-size: 16px; line-height: 1.6; margin-bottom: 10px;">
              Best regards,<br>
              <strong>The Cohorts Team</strong>
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">
            
            <p style="color: #666; font-size: 12px; text-align: center;">
              © ${new Date().getFullYear()} Cohorts.team. All rights reserved.
            </p>
          </div>
        </body>
        </html>
      `,
      attachment: [
        {
          content: brochureBase64,
          name: 'Cohorts-Brochure.pdf',
        },
      ],
    };

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo API error:', errorData);
      return {
        success: false,
        error: errorData.message || 'Failed to send email',
      };
    }

    const data = await response.json();
    console.log('Email sent successfully:', data);

    return {
      success: true,
      messageId: data.messageId,
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
