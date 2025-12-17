import {
  kafkaConsumerManager,
  TOPICS,
  KafkaMessage,
  MessageMetadata,
} from "@repo/kafka";
import { userEventHandler } from "../handlers/user.handler";

const CONSUMER_GROUP_ID = "notification-service";

export async function startUserConsumer(): Promise<void> {
  try {
    console.log("🚀 Starting notification consumer...");

    await kafkaConsumerManager.createConsumer(
      {
        groupId: CONSUMER_GROUP_ID,
        topics: [TOPICS.USER.CREATED, TOPICS.USER.UPDATED],
        enableDLQ: true,
        maxRetries: 3,
      },
      async (message: KafkaMessage, metadata: MessageMetadata) => {
        await userEventHandler.handleMessage(message, metadata);
      }
    );

    console.log("✅ Notification consumer started");
  } catch (error) {
    console.error("❌ Failed to start notification consumer:", error);
    throw error;
  }
}

export async function stopUserConsumer(): Promise<void> {
  await kafkaConsumerManager.disconnectConsumer(CONSUMER_GROUP_ID);
  console.log("Notification consumer stopped");
}
