export { kafkaConfig } from "./config/kafka.config";
export type { KafkaEnvironmentConfig } from "./config/kafka.config";
export { TOPICS, LEGACY_TOPICS } from "./topics";
export type { TopicName, UserTopic, TaskTopic, DLQTopic } from "./topics";
export { kafkaProducer, kafkaConsumerManager, KafkaProducer, KafkaConsumerManager, } from "./core";
export type { MessageHandler, ConsumerOptions } from "./core";
export { createMessage, isValidKafkaMessage, } from "./types/messages";
export type { KafkaMessage, BaseKafkaMessage, MessageMetadata, UserCreatedPayload, UserUpdatedPayload, UserDeletedPayload, TaskCreatedPayload, TaskUpdatedPayload, TaskCompletedPayload, DLQPayload, } from "./types/messages";
export { logLevel } from "kafkajs";
export type { Producer, Consumer } from "kafkajs";
import { Kafka, Producer, Consumer } from "kafkajs";
import { KafkaMessage } from "./types/messages";
declare const kafka: Kafka;
declare const LEGACY_TOPIC_NAMES: {
    readonly USER_CREATED: "user-created";
    readonly USER_UPDATED: "user-updated";
    readonly USER_DELETED: "user-deleted";
};
interface UserCreatedMessage {
    userId: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
}
declare function getProducer(): Promise<Producer>;
declare function disconnectProducer(): Promise<void>;
declare function sendMessage<T>(topic: string, event: string, data: T): Promise<void>;
declare function createConsumer(groupId: string): Promise<Consumer>;
declare function subscribeToTopic(consumer: Consumer, topic: string, handler: (message: KafkaMessage) => Promise<void>): Promise<void>;
export { kafka, getProducer, disconnectProducer, sendMessage, createConsumer, subscribeToTopic, LEGACY_TOPIC_NAMES as TOPICS_LEGACY, };
export { LEGACY_TOPIC_NAMES as TOPICS_V1 };
export type { UserCreatedMessage };
//# sourceMappingURL=index.d.ts.map