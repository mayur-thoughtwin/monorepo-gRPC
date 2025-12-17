import { 
  KafkaMessage, 
  UserCreatedPayload, 
  UserUpdatedPayload,
  MessageMetadata 
} from "@repo/kafka";
import { emailService } from "../services/emailService";

class UserEventHandler {
  async handleUserCreated(
    payload: UserCreatedPayload,
    meta: MessageMetadata
  ): Promise<void> {
    console.log(`[${meta.correlationId}] Processing USER_CREATED for ${payload.email}`);

    const success = await emailService.sendWelcomeEmail(
      payload.email,
      payload.name
    );

    if (!success) {
      // Throw to trigger DLQ mechanism
      throw new Error(`Failed to send welcome email to ${payload.email}`);
    }

    console.log(`[${meta.correlationId}] Welcome email sent successfully to ${payload.email}`);
  }

  async handleUserUpdated(
    payload: UserUpdatedPayload,
    meta: MessageMetadata
  ): Promise<void> {
    console.log(`[${meta.correlationId}] Processing USER_UPDATED for ${payload.userId}`);

    // Determine what changed
    const changes: string[] = [];
    if (payload.email) changes.push("Email address");
    if (payload.name) changes.push("Name");
    if (payload.role) changes.push("Role");

    if (changes.length === 0) {
      console.log(`[${meta.correlationId}] No significant changes to notify about`);
      return;
    }

    // Note: In a real app, you'd fetch the user's email from the database
    // For now, we'll only send if email is included in the update
    if (payload.email) {
      const success = await emailService.sendUserUpdatedEmail(
        payload.email,
        payload.name || "User",
        changes,
        payload.updatedAt
      );

      if (!success) {
        throw new Error(`Failed to send update email to ${payload.email}`);
      }
    }

    console.log(`[${meta.correlationId}] User update notification processed`);
  }

  // Generic message router
  async handleMessage(
    message: KafkaMessage,
    meta: MessageMetadata
  ): Promise<void> {
    switch (message.event) {
      case "USER_CREATED":
        await this.handleUserCreated(message.data as UserCreatedPayload, meta);
        break;
      case "USER_UPDATED":
        await this.handleUserUpdated(message.data as UserUpdatedPayload, meta);
        break;
      default:
        console.log(`[${meta.correlationId}] Unknown event: ${message.event}`);
    }
  }
}

export const userEventHandler = new UserEventHandler();
export { UserEventHandler };

