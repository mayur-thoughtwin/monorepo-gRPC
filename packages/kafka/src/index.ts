import { Kafka, Producer, Consumer, logLevel } from "kafkajs";

// Kafka configuration
const KAFKA_BROKERS = process.env.KAFKA_BROKERS?.split(",") || ["localhost:9092"];
const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID || "monorepo-grpc";

// Create Kafka instance
const kafka = new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers: KAFKA_BROKERS,
  logLevel: logLevel.ERROR,
});

// Topic names
export const TOPICS = {
  USER_CREATED: "user-created",
  USER_UPDATED: "user-updated",
  USER_DELETED: "user-deleted",
} as const;

// Message types
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

// Producer singleton
let producer: Producer | null = null;

export async function getProducer(): Promise<Producer> {
  if (!producer) {
    producer = kafka.producer();
    await producer.connect();
    console.log("✅ Kafka producer connected");
  }
  return producer;
}

export async function disconnectProducer(): Promise<void> {
  if (producer) {
    await producer.disconnect();
    producer = null;
    console.log("Kafka producer disconnected");
  }
}

// Send message to topic
export async function sendMessage<T>(
  topic: string,
  event: string,
  data: T
): Promise<void> {
  const kafkaProducer = await getProducer();
  
  const message: KafkaMessage<T> = {
    event,
    data,
    timestamp: new Date().toISOString(),
  };

  await kafkaProducer.send({
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

// Consumer creation
export async function createConsumer(groupId: string): Promise<Consumer> {
  const consumer = kafka.consumer({ groupId });
  await consumer.connect();
  console.log(`✅ Kafka consumer connected (group: ${groupId})`);
  return consumer;
}

// Subscribe and consume messages
export async function subscribeToTopic(
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

export { kafka, Producer, Consumer };

