import { Consumer, Kafka, EachMessagePayload, KafkaMessage as KafkaJSMessage } from "kafkajs";
import { kafkaConfig } from "../config/kafka.config";
import { KafkaMessage, MessageMetadata, isValidKafkaMessage, DLQPayload, createMessage } from "../types/messages";
import { TOPICS } from "../topics";
import { kafkaProducer } from "./producer";

// Handler function type
export type MessageHandler<T = unknown> = (
  message: KafkaMessage<T>,
  metadata: MessageMetadata
) => Promise<void>;

// Consumer configuration options
export interface ConsumerOptions {
  groupId: string;
  topics: string[];
  fromBeginning?: boolean;
  maxRetries?: number;
  enableDLQ?: boolean;
  sessionTimeout?: number;
  heartbeatInterval?: number;
}

// Default consumer options
const DEFAULT_OPTIONS: Partial<ConsumerOptions> = {
  fromBeginning: false,
  maxRetries: 3,
  enableDLQ: true,
  sessionTimeout: 30000,
  heartbeatInterval: 3000,
};

class KafkaConsumerManager {
  private consumers: Map<string, Consumer> = new Map();
  private kafka: Kafka;

  constructor() {
    this.kafka = new Kafka({
      clientId: `${kafkaConfig.clientId}-consumer`,
      brokers: kafkaConfig.brokers,
      logLevel: kafkaConfig.logLevel,
      retry: kafkaConfig.retry,
    });
  }

  async createConsumer<T = unknown>(
    options: ConsumerOptions,
    handler: MessageHandler<T>
  ): Promise<Consumer> {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    
    const consumer = this.kafka.consumer({
      groupId: opts.groupId,
      sessionTimeout: opts.sessionTimeout,
      heartbeatInterval: opts.heartbeatInterval,
      retry: { retries: opts.maxRetries },
    });

    await consumer.connect();
    console.log(`✅ Consumer [${opts.groupId}] connected`);

    // Subscribe to all specified topics
    for (const topic of opts.topics) {
      await consumer.subscribe({ 
        topic, 
        fromBeginning: opts.fromBeginning 
      });
      console.log(`🎧 Consumer [${opts.groupId}] subscribed to: ${topic}`);
    }

    // Start consuming messages
    await consumer.run({
      autoCommit: true,
      autoCommitInterval: 5000,
      eachMessage: async (payload: EachMessagePayload) => {
        await this.processMessage(payload, handler, opts);
      },
    });

    this.consumers.set(opts.groupId, consumer);
    console.log(`✅ Consumer [${opts.groupId}] started and listening`);

    return consumer;
  }

  private async processMessage<T>(
    payload: EachMessagePayload,
    handler: MessageHandler<T>,
    options: ConsumerOptions
  ): Promise<void> {
    const { topic, partition, message } = payload;
    const value = message.value?.toString();

    if (!value) {
      console.warn(`Empty message received on ${topic}:${partition}`);
      return;
    }

    const headers = this.parseHeaders(message.headers);
    const correlationId = headers.correlationId || "unknown";

    try {
      const parsedMessage = JSON.parse(value);

      if (!isValidKafkaMessage(parsedMessage)) {
        throw new Error("Invalid message structure");
      }

      console.log(`📥 [${correlationId}] Processing message from ${topic} (event: ${parsedMessage.event})`);

      const metadata: MessageMetadata = {
        topic,
        partition,
        offset: message.offset,
        headers,
        correlationId: parsedMessage.correlationId,
      };

      await handler(parsedMessage as KafkaMessage<T>, metadata);
      
      console.log(`✅ [${correlationId}] Message processed successfully`);
    } catch (error) {
      console.error(`❌ [${correlationId}] Failed to process message:`, error);

      if (options.enableDLQ) {
        await this.sendToDLQ(topic, value, error as Error, correlationId);
      }
    }
  }

  private parseHeaders(headers: KafkaJSMessage["headers"]): Record<string, string> {
    const result: Record<string, string> = {};
    if (!headers) return result;

    for (const [key, value] of Object.entries(headers)) {
      if (value) {
        result[key] = Buffer.isBuffer(value) ? value.toString() : String(value);
      }
    }
    return result;
  }

  private async sendToDLQ(
    originalTopic: string,
    messageValue: string,
    error: Error,
    correlationId: string
  ): Promise<void> {
    try {
      let originalMessage: unknown;
      try {
        originalMessage = JSON.parse(messageValue);
      } catch {
        originalMessage = messageValue;
      }

      const dlqPayload: DLQPayload = {
        originalTopic,
        originalMessage,
        error: {
          message: error.message,
          stack: error.stack,
        },
        failedAt: new Date().toISOString(),
        retryCount: 0,
      };

      await kafkaProducer.sendWithCorrelation(
        TOPICS.DLQ.NOTIFICATION,
        "DLQ_MESSAGE",
        dlqPayload,
        "kafka-consumer-manager",
        correlationId
      );

      console.log(`📤 [${correlationId}] Message sent to DLQ`);
    } catch (dlqError) {
      console.error(`❌ [${correlationId}] Failed to send to DLQ:`, dlqError);
    }
  }

  async getConsumer(groupId: string): Promise<Consumer | undefined> {
    return this.consumers.get(groupId);
  }

  async disconnectConsumer(groupId: string): Promise<void> {
    const consumer = this.consumers.get(groupId);
    if (consumer) {
      await consumer.disconnect();
      this.consumers.delete(groupId);
      console.log(`Consumer [${groupId}] disconnected`);
    }
  }

  async disconnectAll(): Promise<void> {
    const disconnectPromises = Array.from(this.consumers.entries()).map(
      async ([groupId, consumer]) => {
        await consumer.disconnect();
        console.log(`Consumer [${groupId}] disconnected`);
      }
    );

    await Promise.all(disconnectPromises);
    this.consumers.clear();
    console.log("All consumers disconnected");
  }

  // Health check for all consumers
  getStatus(): { consumers: string[]; count: number } {
    return {
      consumers: Array.from(this.consumers.keys()),
      count: this.consumers.size,
    };
  }
}

// Singleton instance
export const kafkaConsumerManager = new KafkaConsumerManager();
export { KafkaConsumerManager };

