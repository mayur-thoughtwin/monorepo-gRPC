import { Kafka, Producer, ProducerRecord, CompressionTypes } from "kafkajs";
import { kafkaConfig } from "../config/kafka.config";
import { KafkaMessage, createMessage } from "../types/messages";

class KafkaProducer {
  private producer: Producer | null = null;
  private kafka: Kafka;
  private isConnected = false;
  private connectionPromise: Promise<void> | null = null;

  constructor() {
    this.kafka = new Kafka({
      clientId: kafkaConfig.clientId,
      brokers: kafkaConfig.brokers,
      logLevel: kafkaConfig.logLevel,
      retry: kafkaConfig.retry,
    });
  }

  async connect(): Promise<void> {
    if (this.isConnected) return;
    
    // Prevent multiple simultaneous connection attempts
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = this._connect();
    
    try {
      await this.connectionPromise;
    } finally {
      this.connectionPromise = null;
    }
  }

  private async _connect(): Promise<void> {
    this.producer = this.kafka.producer({
      allowAutoTopicCreation: true,
      transactionTimeout: 30000,
      idempotent: true, // Enable exactly-once semantics
    });

    await this.producer.connect();
    this.isConnected = true;
    console.log("✅ Kafka producer connected");
  }

  async disconnect(): Promise<void> {
    if (!this.producer || !this.isConnected) return;

    await this.producer.disconnect();
    this.isConnected = false;
    this.producer = null;
    console.log("Kafka producer disconnected");
  }

  async send<T>(
    topic: string,
    event: string,
    data: T,
    source: string,
    key?: string
  ): Promise<string> {
    if (!this.producer || !this.isConnected) {
      await this.connect();
    }

    const message = createMessage(event, data, source);

    const record: ProducerRecord = {
      topic,
      compression: CompressionTypes.GZIP, // Compress for better throughput
      messages: [
        {
          key: key || message.correlationId,
          value: JSON.stringify(message),
          headers: {
            correlationId: message.correlationId,
            event,
            source,
            timestamp: message.timestamp,
          },
        },
      ],
    };

    await this.producer!.send(record);
    console.log(`📤 [${message.correlationId}] Message sent to ${topic} (event: ${event})`);
    
    return message.correlationId;
  }

  async sendWithCorrelation<T>(
    topic: string,
    event: string,
    data: T,
    source: string,
    correlationId: string
  ): Promise<void> {
    if (!this.producer || !this.isConnected) {
      await this.connect();
    }

    const message = createMessage(event, data, source, correlationId);

    const record: ProducerRecord = {
      topic,
      compression: CompressionTypes.GZIP,
      messages: [
        {
          key: correlationId,
          value: JSON.stringify(message),
          headers: {
            correlationId,
            event,
            source,
            timestamp: message.timestamp,
          },
        },
      ],
    };

    await this.producer!.send(record);
    console.log(`📤 [${correlationId}] Message sent to ${topic} (event: ${event})`);
  }

  // Batch sending for high throughput scenarios
  async sendBatch<T>(
    topic: string,
    messages: Array<{ event: string; data: T; key?: string }>,
    source: string
  ): Promise<string[]> {
    if (!this.producer || !this.isConnected) {
      await this.connect();
    }

    const correlationIds: string[] = [];
    
    const kafkaMessages = messages.map((msg) => {
      const message = createMessage(msg.event, msg.data, source);
      correlationIds.push(message.correlationId);
      
      return {
        key: msg.key || message.correlationId,
        value: JSON.stringify(message),
        headers: {
          correlationId: message.correlationId,
          event: msg.event,
          source,
        },
      };
    });

    await this.producer!.send({
      topic,
      compression: CompressionTypes.GZIP,
      messages: kafkaMessages,
    });

    console.log(`📤 Batch of ${messages.length} messages sent to ${topic}`);
    return correlationIds;
  }

  // Health check for monitoring
  async healthCheck(): Promise<boolean> {
    return this.isConnected && this.producer !== null;
  }

  getStatus(): { connected: boolean } {
    return { connected: this.isConnected };
  }
}

// Singleton instance
export const kafkaProducer = new KafkaProducer();
export { KafkaProducer };

