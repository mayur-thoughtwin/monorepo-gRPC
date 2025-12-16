import {
  createConsumer,
  subscribeToTopic,
  TOPICS,
  KafkaMessage,
  UserCreatedMessage,
  Consumer,
} from "@repo/kafka";
import { sendWelcomeEmail } from "../services/emailService";

let consumer: Consumer | null = null;

async function handleUserCreatedMessage(message: KafkaMessage): Promise<void> {
  if (message.event === "USER_CREATED") {
    const userData = message.data as UserCreatedMessage;
    
    console.log(`📬 Processing user created event for: ${userData.email}`);
    
    // Send welcome email
    const emailSent = await sendWelcomeEmail(userData.email, userData.name);
    
    if (emailSent) {
      console.log(`✅ Welcome email sent to ${userData.email}`);
    } else {
      console.error(`❌ Failed to send welcome email to ${userData.email}`);
    }
  }
}

export async function startUserConsumer(): Promise<void> {
  try {
    consumer = await createConsumer("notification-service");
    
    await subscribeToTopic(
      consumer,
      TOPICS.USER_CREATED,
      handleUserCreatedMessage
    );
    
    console.log(`🎧 Listening for user events on topic: ${TOPICS.USER_CREATED}`);
  } catch (error) {
    console.error("Failed to start user consumer:", error);
    throw error;
  }
}

export async function stopUserConsumer(): Promise<void> {
  if (consumer) {
    await consumer.disconnect();
    consumer = null;
    console.log("User consumer disconnected");
  }
}

