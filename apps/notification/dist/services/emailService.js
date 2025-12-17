"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.sendWelcomeEmail = exports.emailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const email_config_1 = require("../config/email.config");
const welcome_template_1 = require("../templates/welcome.template");
const user_updated_template_1 = require("../templates/user-updated.template");
class EmailService {
    constructor() {
        this.isReady = false;
        this.transporter = nodemailer_1.default.createTransport({
            service: email_config_1.emailConfig.service,
            auth: {
                user: email_config_1.emailConfig.user,
                pass: email_config_1.emailConfig.password,
            },
            pool: true, // Use connection pooling for better performance
            maxConnections: email_config_1.emailConfig.pool.maxConnections,
            rateDelta: email_config_1.emailConfig.pool.rateDelta,
            rateLimit: email_config_1.emailConfig.pool.rateLimit,
        });
    }
    async initialize() {
        try {
            await this.transporter.verify();
            this.isReady = true;
            console.log("✅ Email service ready");
        }
        catch (error) {
            console.error("❌ Email service initialization failed:", error);
            // Don't throw - allow service to start even if email isn't working
            this.isReady = false;
        }
    }
    async sendEmail(options) {
        try {
            const info = await this.transporter.sendMail({
                from: `"${email_config_1.emailConfig.fromName}" <${email_config_1.emailConfig.user}>`,
                to: options.to,
                subject: options.subject,
                text: options.text,
                html: options.html,
            });
            console.log(`📧 Email sent: ${info.messageId} to ${options.to}`);
            return { success: true, messageId: info.messageId };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            console.error(`❌ Failed to send email to ${options.to}:`, errorMessage);
            return { success: false, error: errorMessage };
        }
    }
    async sendWelcomeEmail(email, name) {
        const data = { email, name };
        const content = welcome_template_1.welcomeTemplate.getContent(data);
        const result = await this.sendEmail({
            to: email,
            subject: content.subject,
            text: content.text,
            html: content.html,
        });
        return result.success;
    }
    async sendUserUpdatedEmail(email, name, changes, updatedAt) {
        const data = { email, name, changes, updatedAt };
        const content = user_updated_template_1.userUpdatedTemplate.getContent(data);
        const result = await this.sendEmail({
            to: email,
            subject: content.subject,
            text: content.text,
            html: content.html,
        });
        return result.success;
    }
    // Health check for monitoring
    async healthCheck() {
        try {
            await this.transporter.verify();
            return { healthy: true, message: "Email service is healthy" };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            return { healthy: false, message: errorMessage };
        }
    }
    getStatus() {
        return { ready: this.isReady };
    }
}
// Singleton instance
exports.emailService = new EmailService();
// Legacy export for backward compatibility
const sendWelcomeEmail = async (email, name) => {
    return exports.emailService.sendWelcomeEmail(email, name);
};
exports.sendWelcomeEmail = sendWelcomeEmail;
// Legacy sendEmail export
const sendEmail = async (options) => {
    const transporter = nodemailer_1.default.createTransport({
        service: email_config_1.emailConfig.service,
        auth: {
            user: email_config_1.emailConfig.user,
            pass: email_config_1.emailConfig.password,
        },
    });
    await transporter.sendMail({
        from: email_config_1.emailConfig.user,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
    });
    console.log("Email sent to:", options.to);
};
exports.sendEmail = sendEmail;
