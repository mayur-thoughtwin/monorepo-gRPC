import {
  KafkaMessage,
  TaskCreatedPayload,
  TaskUpdatedPayload,
  TaskCompletedPayload,
  MessageMetadata,
} from "@repo/kafka";
import { emailService } from "../services/emailService";

// Admin email configuration - in production, get from environment or database
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin12@yopmail.com";
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin";

class TaskEventHandler {
  async handleTaskCreated(
    payload: TaskCreatedPayload,
    meta: MessageMetadata
  ): Promise<void> {
    console.log(`[${meta.correlationId}] Processing TASK_CREATED for task: ${payload.taskId}`);

    // Send notification email to admin
    const success = await emailService.sendTaskCreatedEmail(
      ADMIN_EMAIL,
      ADMIN_NAME,
      {
        taskId: payload.taskId,
        taskName: payload.title,
        userId: payload.userId,
        userName: payload.userName,
        createdAt: payload.createdAt,
      }
    );

    if (!success) {
      // Throw to trigger DLQ mechanism
      throw new Error(`Failed to send task creation notification to admin (${ADMIN_EMAIL})`);
    }

    console.log(`[${meta.correlationId}] Task creation notification sent successfully to ${ADMIN_EMAIL}`);
    console.log(`[${meta.correlationId}] 📧 Admin notified: New task "${payload.title}" created by ${payload.userName} (${payload.userId})`);
  }

  async handleTaskUpdated(
    payload: TaskUpdatedPayload,
    meta: MessageMetadata
  ): Promise<void> {
    console.log(`[${meta.correlationId}] Processing TASK_UPDATED for task: ${payload.taskId}`);

    // Log the update (extend this to send notifications as needed)
    const changes: string[] = [];
    if (payload.title) changes.push(`Title: ${payload.title}`);
    if (payload.status) changes.push(`Status: ${payload.status}`);

    console.log(`[${meta.correlationId}] Task ${payload.taskId} updated: ${changes.join(", ")}`);
  }

  async handleTaskCompleted(
    payload: TaskCompletedPayload,
    meta: MessageMetadata
  ): Promise<void> {
    console.log(`[${meta.correlationId}] Processing TASK_COMPLETED for task: ${payload.taskId}`);
    console.log(`[${meta.correlationId}] Task ${payload.taskId} completed by user ${payload.userId} at ${payload.completedAt}`);
  }

  // Generic message router
  async handleMessage(
    message: KafkaMessage,
    meta: MessageMetadata
  ): Promise<void> {
    switch (message.event) {
      case "TASK_CREATED":
        await this.handleTaskCreated(message.data as TaskCreatedPayload, meta);
        break;
      case "TASK_UPDATED":
        await this.handleTaskUpdated(message.data as TaskUpdatedPayload, meta);
        break;
      case "TASK_COMPLETED":
        await this.handleTaskCompleted(message.data as TaskCompletedPayload, meta);
        break;
      default:
        console.log(`[${meta.correlationId}] Unknown task event: ${message.event}`);
    }
  }
}

export const taskEventHandler = new TaskEventHandler();
export { TaskEventHandler };

