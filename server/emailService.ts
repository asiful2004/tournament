import nodemailer from 'nodemailer';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || process.env.EMAIL_USER,
        pass: process.env.SMTP_PASSWORD || process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendTournamentReminder(
    email: string,
    tournamentName: string,
    minutesUntilStart: number,
    secretInfo?: { roomId?: string; roomPassword?: string; partyCode?: string }
  ) {
    const subject = `Tournament Reminder: ${tournamentName} - ${minutesUntilStart} minutes to start!`;
    
    let html = `
      <div style="background: #0F0F23; color: #ffffff; padding: 20px; font-family: Inter, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background: #1A1A2E; border-radius: 12px; padding: 30px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #7C3AED; font-size: 28px; margin-bottom: 10px;">🔥 Tournament Alert!</h1>
            <h2 style="color: #ffffff; font-size: 24px; margin: 0;">${tournamentName}</h2>
          </div>
          
          <div style="background: #16213E; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #A855F7; margin-top: 0;">⏰ Starting in ${minutesUntilStart} minutes!</h3>
            <p style="color: #E5E7EB; font-size: 16px;">Get ready for an epic battle! Make sure you're prepared.</p>
          </div>
          
          ${secretInfo ? `
            <div style="background: #065F46; border: 2px solid #10B981; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
              <h3 style="color: #10B981; margin-top: 0;">🔓 Secret Match Information</h3>
              ${secretInfo.roomId ? `<p><strong>Room ID:</strong> <code style="background: #000; padding: 4px 8px; border-radius: 4px;">${secretInfo.roomId}</code></p>` : ''}
              ${secretInfo.roomPassword ? `<p><strong>Password:</strong> <code style="background: #000; padding: 4px 8px; border-radius: 4px;">${secretInfo.roomPassword}</code></p>` : ''}
              ${secretInfo.partyCode ? `<p><strong>Party Code:</strong> <code style="background: #000; padding: 4px 8px; border-radius: 4px;">${secretInfo.partyCode}</code></p>` : ''}
            </div>
          ` : ''}
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #9CA3AF; font-size: 14px;">Good luck and may the best player win! 🏆</p>
          </div>
        </div>
      </div>
    `;

    await this.transporter.sendMail({
      from: process.env.FROM_EMAIL || 'noreply@fftournament.com',
      to: email,
      subject,
      html,
    });
  }

  async sendPaymentConfirmation(email: string, tournamentName: string, amount: number, status: string) {
    const subject = `Payment ${status === 'approved' ? 'Approved' : 'Update'}: ${tournamentName}`;
    
    const html = `
      <div style="background: #0F0F23; color: #ffffff; padding: 20px; font-family: Inter, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background: #1A1A2E; border-radius: 12px; padding: 30px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #7C3AED; font-size: 28px; margin-bottom: 10px;">💳 Payment Update</h1>
          </div>
          
          <div style="background: ${status === 'approved' ? '#065F46' : '#7F1D1D'}; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: ${status === 'approved' ? '#10B981' : '#EF4444'}; margin-top: 0;">
              ${status === 'approved' ? '✅ Payment Approved' : '❌ Payment Rejected'}
            </h3>
            <p><strong>Tournament:</strong> ${tournamentName}</p>
            <p><strong>Amount:</strong> ৳ ${amount}</p>
            <p style="color: #E5E7EB;">
              ${status === 'approved' 
                ? 'Your payment has been verified and approved. You can now participate in the tournament!'
                : 'Your payment could not be verified. Please contact support or submit a new payment.'
              }
            </p>
          </div>
        </div>
      </div>
    `;

    await this.transporter.sendMail({
      from: process.env.FROM_EMAIL || 'noreply@fftournament.com',
      to: email,
      subject,
      html,
    });
  }

  async sendWebsiteDownloadLink(email: string, downloadToken: string) {
    const downloadUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/api/download/${downloadToken}`;
    const subject = 'Website Source Code Download Link';
    
    const html = `
      <div style="background: #0F0F23; color: #ffffff; padding: 20px; font-family: Inter, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background: #1A1A2E; border-radius: 12px; padding: 30px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #7C3AED; font-size: 28px; margin-bottom: 10px;">🚀 Source Code Ready!</h1>
          </div>
          
          <div style="background: #065F46; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #10B981; margin-top: 0;">✅ Download Approved</h3>
            <p style="color: #E5E7EB;">Your website source code purchase has been approved! Click the link below to download:</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${downloadUrl}" style="display: inline-block; background: linear-gradient(135deg, #7C3AED, #A855F7); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                Download Source Code
              </a>
            </div>
            <p style="color: #FCD34D; font-size: 14px;"><strong>⚠️ Important:</strong> This link expires in 7 days. Download immediately!</p>
          </div>
        </div>
      </div>
    `;

    await this.transporter.sendMail({
      from: process.env.FROM_EMAIL || 'noreply@fftournament.com',
      to: email,
      subject,
      html,
    });
  }
}

export const emailService = new EmailService();
