import {
  kafkaConsumerManager,
  TOPICS,
  KafkaMessage,
  MessageMetadata,
} from "@repo/kafka";
import { taskEventHandler } from "../handlers/task.handler";

const CONSUMER_GROUP_ID = "notification-service-tasks";

export async function startTaskConsumer(): Promise<void> {
  try {
    console.log("🚀 Starting task notification consumer...");

    await kafkaConsumerManager.createConsumer(
      {
        groupId: CONSUMER_GROUP_ID,
        topics: [TOPICS.TASK.CREATED, TOPICS.TASK.UPDATED, TOPICS.TASK.COMPLETED],
        enableDLQ: true,
        maxRetries: 3,
      },
      async (message: KafkaMessage, metadata: MessageMetadata) => {
        await taskEventHandler.handleMessage(message, metadata);
      }
    );

    console.log("✅ Task notification consumer started");
  } catch (error) {
    console.error("❌ Failed to start task notification consumer:", error);
    throw error;
  }
}

export async function stopTaskConsumer(): Promise<void> {
  await kafkaConsumerManager.disconnectConsumer(CONSUMER_GROUP_ID);
  console.log("Task notification consumer stopped");
}

