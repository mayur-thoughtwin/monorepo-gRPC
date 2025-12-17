// Main exports - organized by module
export { kafkaConfig } from "./config/kafka.config";
export type { KafkaEnvironmentConfig } from "./config/kafka.config";

export { TOPICS } from "./topics";
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
