import { Kafka, Producer, Consumer } from "kafkajs";
declare const kafka: Kafka;
export declare const TOPICS: {
    readonly USER_CREATED: "user-created";
    readonly USER_UPDATED: "user-updated";
    readonly USER_DELETED: "user-deleted";
};
export interface UserCreatedMessage {
    userId: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
}
export interface KafkaMessage<T = unknown> {
    event: string;
    data: T;
    timestamp: string;
}
export declare function getProducer(): Promise<Producer>;
export declare function disconnectProducer(): Promise<void>;
export declare function sendMessage<T>(topic: string, event: string, data: T): Promise<void>;
export declare function createConsumer(groupId: string): Promise<Consumer>;
export declare function subscribeToTopic(consumer: Consumer, topic: string, handler: (message: KafkaMessage) => Promise<void>): Promise<void>;
export { kafka, Producer, Consumer };
//# sourceMappingURL=index.d.ts.map