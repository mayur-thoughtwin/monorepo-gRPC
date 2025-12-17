import {
  kafkaConsumerManager,
  TOPICS,
  KafkaMessage,
  MessageMetadata,
  Consumer,
  // Legacy imports for backward compatibility
  createConsumer,
  subscribeToTopic,
  LEGACY_TOPICS,
  UserCreatedMessage,
} from "@repo/kafka";
import { userEventHandler } from "../handlers/user.handler";
import { sendWelcomeEmail } from "../services/emailService";

let consumer: Consumer | null = null;
const CONSUMER_GROUP_ID = "notification-service";

// ============================================
// NEW API - Using refactored Kafka modules
// ============================================

export async function startUserConsumerNew(): Promise<void> {
  try {
    console.log("🚀 Starting notification consumer with new API...");

    await kafkaConsumerManager.createConsumer(
      {
        groupId: CONSUMER_GROUP_ID,
        topics: [
          TOPICS.USER.CREATED,
          TOPICS.USER.UPDATED,
        ],
        enableDLQ: true,
        maxRetries: 3,
      },
      async (message: KafkaMessage, metadata: MessageMetadata) => {
        await userEventHandler.handleMessage(message, metadata);
      }
    );

    console.log("✅ Notification consumer started with new API");
  } catch (error) {
    console.error("❌ Failed to start notification consumer:", error);
    throw error;
  }
}

export async function stopUserConsumerNew(): Promise<void> {
  await kafkaConsumerManager.disconnectConsumer(CONSUMER_GROUP_ID);
  console.log("Notification consumer stopped");
}

// ============================================
// LEGACY API - For backward compatibility
// ============================================

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
    // Try new API first, fall back to legacy
    const useNewApi = process.env.USE_NEW_KAFKA_API === "true";

    if (useNewApi) {
      await startUserConsumerNew();
      return;
    }

    // Legacy implementation
    consumer = await createConsumer(CONSUMER_GROUP_ID);

    await subscribeToTopic(
      consumer,
      LEGACY_TOPICS.USER_CREATED,
      handleUserCreatedMessage
    );

    console.log(`🎧 Listening for user events on topic: ${LEGACY_TOPICS.USER_CREATED}`);
  } catch (error) {
    console.error("Failed to start user consumer:", error);
    throw error;
  }
}

export async function stopUserConsumer(): Promise<void> {
  const useNewApi = process.env.USE_NEW_KAFKA_API === "true";

  if (useNewApi) {
    await stopUserConsumerNew();
    return;
  }

  // Legacy implementation
  if (consumer) {
    await consumer.disconnect();
    consumer = null;
    console.log("User consumer disconnected");
  }
}
