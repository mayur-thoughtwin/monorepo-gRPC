import { Consumer } from "kafkajs";
import { KafkaMessage, MessageMetadata } from "../types/messages";
export type MessageHandler<T = unknown> = (message: KafkaMessage<T>, metadata: MessageMetadata) => Promise<void>;
export interface ConsumerOptions {
    groupId: string;
    topics: string[];
    fromBeginning?: boolean;
    maxRetries?: number;
    enableDLQ?: boolean;
    sessionTimeout?: number;
    heartbeatInterval?: number;
}
declare class KafkaConsumerManager {
    private consumers;
    private kafka;
    constructor();
    createConsumer<T = unknown>(options: ConsumerOptions, handler: MessageHandler<T>): Promise<Consumer>;
    private processMessage;
    private parseHeaders;
    private sendToDLQ;
    getConsumer(groupId: string): Promise<Consumer | undefined>;
    disconnectConsumer(groupId: string): Promise<void>;
    disconnectAll(): Promise<void>;
    getStatus(): {
        consumers: string[];
        count: number;
    };
}
export declare const kafkaConsumerManager: KafkaConsumerManager;
export { KafkaConsumerManager };
//# sourceMappingURL=consumer.d.ts.map