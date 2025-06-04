const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendEmail(to, subject, html) {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM,
        to,
        subject,
        html,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new Error('Email sending failed');
    }
  }

  async sendVerificationEmail(user, verificationToken) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    
    const html = `
      <h1>Verify Your Email</h1>
      <p>Hello ${user.name},</p>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account, please ignore this email.</p>
    `;

    await this.sendEmail(user.email, 'Email Verification', html);
  }

  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    const html = `
      <h1>Reset Your Password</h1>
      <p>Hello ${user.name},</p>
      <p>You requested to reset your password. Please click the link below:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    await this.sendEmail(user.email, 'Password Reset', html);
  }

  async sendLoginAlert(user, loginInfo) {
    const html = `
      <h1>New Login Detected</h1>
      <p>Hello ${user.name},</p>
      <p>We detected a new login to your account:</p>
      <ul>
        <li>Time: ${new Date(loginInfo.time).toLocaleString()}</li>
        <li>IP Address: ${loginInfo.ip}</li>
        <li>Device: ${loginInfo.userAgent}</li>
      </ul>
      <p>If this wasn't you, please change your password immediately.</p>
    `;

    await this.sendEmail(user.email, 'New Login Alert', html);
  }

  async sendPasswordChangeNotification(user) {
    const html = `
      <h1>Password Changed</h1>
      <p>Hello ${user.name},</p>
      <p>Your password was recently changed.</p>
      <p>If you didn't make this change, please contact support immediately.</p>
    `;

    await this.sendEmail(user.email, 'Password Changed', html);
  }
}

module.exports = new EmailService(); 