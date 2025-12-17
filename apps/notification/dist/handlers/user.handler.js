"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEventHandler = exports.userEventHandler = void 0;
const emailService_1 = require("../services/emailService");
class UserEventHandler {
    async handleUserCreated(payload, meta) {
        console.log(`[${meta.correlationId}] Processing USER_CREATED for ${payload.email}`);
        const success = await emailService_1.emailService.sendWelcomeEmail(payload.email, payload.name);
        if (!success) {
            // Throw to trigger DLQ mechanism
            throw new Error(`Failed to send welcome email to ${payload.email}`);
        }
        console.log(`[${meta.correlationId}] Welcome email sent successfully to ${payload.email}`);
    }
    async handleUserUpdated(payload, meta) {
        console.log(`[${meta.correlationId}] Processing USER_UPDATED for ${payload.userId}`);
        // Determine what changed
        const changes = [];
        if (payload.email)
            changes.push("Email address");
        if (payload.name)
            changes.push("Name");
        if (payload.role)
            changes.push("Role");
        if (changes.length === 0) {
            console.log(`[${meta.correlationId}] No significant changes to notify about`);
            return;
        }
        // Note: In a real app, you'd fetch the user's email from the database
        // For now, we'll only send if email is included in the update
        if (payload.email) {
            const success = await emailService_1.emailService.sendUserUpdatedEmail(payload.email, payload.name || "User", changes, payload.updatedAt);
            if (!success) {
                throw new Error(`Failed to send update email to ${payload.email}`);
            }
        }
        console.log(`[${meta.correlationId}] User update notification processed`);
    }
    // Generic message router
    async handleMessage(message, meta) {
        switch (message.event) {
            case "USER_CREATED":
                await this.handleUserCreated(message.data, meta);
                break;
            case "USER_UPDATED":
                await this.handleUserUpdated(message.data, meta);
                break;
            default:
                console.log(`[${meta.correlationId}] Unknown event: ${message.event}`);
        }
    }
}
exports.UserEventHandler = UserEventHandler;
exports.userEventHandler = new UserEventHandler();
