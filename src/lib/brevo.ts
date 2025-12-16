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
          <div style="max-width: 600px; margin: 0 auto;">
            <!-- Header with logo -->
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="https://www.cohorts.team/logo_blue.svg" alt="cohorts.team" style="height: 40px; margin-bottom: 8px;" />
              <p style="color: #004aad; font-size: 14px; margin: 0;">More for less</p>
            </div>
            
            <!-- Main content card -->
            <div style="background-color: #ffffff; border-radius: 24px; padding: 40px; border: 1px solid #001640; border-opacity: 0.1;">
              <h1 style="color: #001640; font-size: 28px; margin-bottom: 24px; font-weight: normal;">Hi ${toName},</h1>
              
              <p style="color: #001640; font-size: 16px; line-height: 1.7; margin-bottom: 20px;">
                Thank you for your interest in <span style="color: #004aad; font-weight: 600;">Cohorts.team</span>!
              </p>
              
              <p style="color: #001640; font-size: 16px; line-height: 1.7; margin-bottom: 20px;">
                Please find attached our comprehensive brochure with everything you need to know about how we can help your business achieve more for less.
              </p>
              
              <p style="color: #001640; font-size: 16px; line-height: 1.7; margin-bottom: 30px;">
                If you have any questions or would like to discuss how we can work together, feel free to reach out to us on 
                <a href="https://www.linkedin.com/company/cohorts-team" style="color: #004aad; text-decoration: none; font-weight: 600;">LinkedIn</a>.
              </p>
              
              <p style="color: #001640; font-size: 16px; line-height: 1.7; margin-bottom: 10px;">
                Best regards,<br>
                <strong style="color: #004aad;">cohorts.team</strong>
              </p>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; padding: 20px;">
              <p style="color: #001640; font-size: 12px; margin: 0; opacity: 0.6;">
                © ${new Date().getFullYear()} Cohorts.team. All rights reserved.
              </p>
              <p style="color: #001640; font-size: 12px; margin-top: 10px; opacity: 0.6;">
                Made with ❤️ for Ad agencies
              </p>
            </div>
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

interface LeadInfo {
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

/**
 * Send admin notification email when a new lead is received
 */
export async function sendAdminNotification(
  lead: LeadInfo
): Promise<SendEmailResponse> {
  const apiKey = process.env.BREVO_API_KEY;
  const adminEmail = 'deepak@cohorts.team';

  if (!apiKey) {
    console.error('BREVO_API_KEY is not configured');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const emailPayload: BrevoEmailPayload = {
      sender: {
        name: 'Cohorts Lead Notification',
        email: 'noreply@cohorts.team',
      },
      to: [
        {
          email: adminEmail,
          name: 'Deepak',
        },
      ],
      subject: `📥 New Lead: ${lead.name}`,
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Red Hat Display', Arial, sans-serif; margin: 0; padding: 40px 20px; background-color: #fffcf3;">
          <div style="max-width: 600px; margin: 0 auto;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="https://cohorts.team/logo_white.svg" alt="cohorts.team" style="height: 40px; margin-bottom: 8px;" />
              <p style="color: #004aad; font-size: 14px; margin: 0;">Lead Notification</p>
            </div>
            
            <!-- Main content card -->
            <div style="background-color: #ffffff; border-radius: 24px; padding: 40px; border: 1px solid #001640; border-opacity: 0.1;">
              <h1 style="color: #001640; font-size: 24px; margin-bottom: 24px; font-weight: normal;">🎉 New Lead Received!</h1>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; color: #666; font-size: 14px; width: 120px;">Name</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; color: #001640; font-size: 16px; font-weight: 600;">${lead.name}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; color: #666; font-size: 14px;">Email</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; color: #004aad; font-size: 16px;">
                    <a href="mailto:${lead.email}" style="color: #004aad; text-decoration: none; font-weight: 600;">${lead.email}</a>
                  </td>
                </tr>
                ${lead.phone ? `
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; color: #666; font-size: 14px;">Phone</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; color: #001640; font-size: 16px;">
                    <a href="tel:${lead.phone}" style="color: #004aad; text-decoration: none;">${lead.phone}</a>
                  </td>
                </tr>
                ` : ''}
                ${lead.company ? `
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; color: #666; font-size: 14px;">Company</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; color: #001640; font-size: 16px;">${lead.company}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 12px 0; color: #666; font-size: 14px;">Time</td>
                  <td style="padding: 12px 0; color: #001640; font-size: 16px;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                </tr>
              </table>
              
              <div style="margin-top: 24px; padding: 16px; background-color: #fffcf3; border-radius: 12px; border: 1px solid #004aad; border-opacity: 0.2;">
                <p style="margin: 0; color: #004aad; font-size: 14px;">
                  ✅ The brochure has been automatically sent to the lead's email address.
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; padding: 20px;">
              <p style="color: #001640; font-size: 12px; margin: 0; opacity: 0.6;">
                This is an automated notification from cohorts.team
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
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
      console.error('Brevo API error (admin notification):', errorData);
      return {
        success: false,
        error: errorData.message || 'Failed to send admin notification',
      };
    }

    const data = await response.json();
    console.log('Admin notification sent successfully:', data);

    return {
      success: true,
      messageId: data.messageId,
    };
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
