// Main exports - organized by module
export { kafkaConfig } from "./config/kafka.config";
export type { KafkaEnvironmentConfig } from "./config/kafka.config";

export { TOPICS, LEGACY_TOPICS } from "./topics";
export type { TopicName, UserTopic, TaskTopic, DLQTopic } from "./topics";

export {
  kafkaProducer,
  kafkaConsumerManager,
  KafkaProducer,
  KafkaConsumerManager,
} from "./core";
export type { MessageHandler, ConsumerOptions } from "./core";

export {
  createMessage,
  isValidKafkaMessage,
} from "./types/messages";

export type {
  KafkaMessage,
  BaseKafkaMessage,
  MessageMetadata,
  UserCreatedPayload,
  UserUpdatedPayload,
  UserDeletedPayload,
  TaskCreatedPayload,
  TaskUpdatedPayload,
  TaskCompletedPayload,
  DLQPayload,
} from "./types/messages";

// Re-export kafkajs types that consumers might need
export { logLevel } from "kafkajs";
export type { Producer, Consumer } from "kafkajs";

// ============================================
// BACKWARD COMPATIBILITY LAYER
// These exports maintain compatibility with existing code
// TODO: Migrate consumers to use new API and remove this section
// ============================================

import { Kafka, Producer, Consumer, logLevel } from "kafkajs";
import { kafkaConfig } from "./config/kafka.config";
import { kafkaProducer } from "./core/producer";
import { kafkaConsumerManager, MessageHandler } from "./core/consumer";
import { KafkaMessage, createMessage } from "./types/messages";

// Legacy kafka instance (avoid using directly)
const kafka = new Kafka({
  clientId: kafkaConfig.clientId,
  brokers: kafkaConfig.brokers,
  logLevel: kafkaConfig.logLevel,
});

// Legacy topic names for backward compatibility
const LEGACY_TOPIC_NAMES = {
  USER_CREATED: "user-created",
  USER_UPDATED: "user-updated", 
  USER_DELETED: "user-deleted",
} as const;

// Legacy message type (use UserCreatedPayload instead)
interface UserCreatedMessage {
  userId: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

// Legacy producer functions
let legacyProducer: Producer | null = null;

async function getProducer(): Promise<Producer> {
  if (!legacyProducer) {
    legacyProducer = kafka.producer();
    await legacyProducer.connect();
    console.log("✅ Kafka producer connected (legacy)");
  }
  return legacyProducer;
}

async function disconnectProducer(): Promise<void> {
  if (legacyProducer) {
    await legacyProducer.disconnect();
    legacyProducer = null;
    console.log("Kafka producer disconnected (legacy)");
  }
  // Also disconnect new producer
  await kafkaProducer.disconnect();
}

async function sendMessage<T>(
  topic: string,
  event: string,
  data: T
): Promise<void> {
  const producer = await getProducer();

  const message: KafkaMessage<T> = createMessage(event, data, "legacy-producer");

  await producer.send({
    topic,
    messages: [
      {
        key: event,
        value: JSON.stringify(message),
      },
    ],
  });

  console.log(`📤 Kafka message sent to topic: ${topic}, event: ${event}`);
}

// Legacy consumer functions
async function createConsumer(groupId: string): Promise<Consumer> {
  const consumer = kafka.consumer({ groupId });
  await consumer.connect();
  console.log(`✅ Kafka consumer connected (group: ${groupId})`);
  return consumer;
}

async function subscribeToTopic(
  consumer: Consumer,
  topic: string,
  handler: (message: KafkaMessage) => Promise<void>
): Promise<void> {
  await consumer.subscribe({ topic, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const value = message.value?.toString();
        if (value) {
          const parsedMessage = JSON.parse(value) as KafkaMessage;
          console.log(`📥 Kafka message received from topic: ${topic}`);
          await handler(parsedMessage);
        }
      } catch (error) {
        console.error("Error processing Kafka message:", error);
      }
    },
  });
}

// Legacy exports (deprecated - use new API)
export {
  kafka,
  getProducer,
  disconnectProducer,
  sendMessage,
  createConsumer,
  subscribeToTopic,
  LEGACY_TOPIC_NAMES as TOPICS_LEGACY,
};

// Re-export legacy TOPICS constant for backward compatibility
export { LEGACY_TOPIC_NAMES as TOPICS_V1 };

// Legacy type export
export type { UserCreatedMessage };
