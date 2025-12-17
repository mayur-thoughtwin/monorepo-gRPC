import nodemailer, { Transporter } from "nodemailer";
import { emailConfig } from "../config/email.config";
import { welcomeTemplate } from "../templates/welcome.template";
import { userUpdatedTemplate, UserUpdatedTemplateData } from "../templates/user-updated.template";

interface SendMailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

class EmailService {
  private transporter: Transporter;
  private isReady = false;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: emailConfig.service,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.password,
      },
      pool: true, // Use connection pooling for better performance
      maxConnections: emailConfig.pool.maxConnections,
      rateDelta: emailConfig.pool.rateDelta,
      rateLimit: emailConfig.pool.rateLimit,
    });
  }

  async initialize(): Promise<void> {
    try {
      await this.transporter.verify();
      this.isReady = true;
      console.log("✅ Email service ready");
    } catch (error) {
      console.error("❌ Email service initialization failed:", error);
      // Don't throw - allow service to start even if email isn't working
      this.isReady = false;
    }
  }

  private async sendEmail(options: SendMailOptions): Promise<EmailResult> {
    try {
      const info = await this.transporter.sendMail({
        from: `"${emailConfig.fromName}" <${emailConfig.user}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      console.log(`📧 Email sent: ${info.messageId} to ${options.to}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error(`❌ Failed to send email to ${options.to}:`, errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const data = { email, name };
    const content = welcomeTemplate.getContent(data);

    const result = await this.sendEmail({
      to: email,
      subject: content.subject,
      text: content.text,
      html: content.html,
    });

    return result.success;
  }

  async sendUserUpdatedEmail(
    email: string,
    name: string,
    changes: string[],
    updatedAt: string
  ): Promise<boolean> {
    const data: UserUpdatedTemplateData = { email, name, changes, updatedAt };
    const content = userUpdatedTemplate.getContent(data);

    const result = await this.sendEmail({
      to: email,
      subject: content.subject,
      text: content.text,
      html: content.html,
    });

    return result.success;
  }

  // Health check for monitoring
  async healthCheck(): Promise<{ healthy: boolean; message: string }> {
    try {
      await this.transporter.verify();
      return { healthy: true, message: "Email service is healthy" };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return { healthy: false, message: errorMessage };
    }
  }

  getStatus(): { ready: boolean } {
    return { ready: this.isReady };
  }
}

// Singleton instance
export const emailService = new EmailService();

// Legacy export for backward compatibility
export const sendWelcomeEmail = async (email: string, name: string): Promise<boolean> => {
  return emailService.sendWelcomeEmail(email, name);
};

// Legacy sendEmail export
export const sendEmail = async (options: {
  html?: string;
  to: string;
  subject: string;
  text: string;
}): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: emailConfig.service,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.password,
    },
  });

  await transporter.sendMail({
    from: emailConfig.user,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });
  
  console.log("Email sent to:", options.to);
};
