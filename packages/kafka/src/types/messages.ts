import { randomUUID } from "crypto";

// Base message interface with metadata for tracing and debugging
export interface BaseKafkaMessage {
  correlationId: string;
  timestamp: string;
  version: string;
  source: string;
}

// Generic Kafka message wrapper
export interface KafkaMessage<T = unknown> extends BaseKafkaMessage {
  event: string;
  data: T;
}

// User domain payloads
export interface UserCreatedPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export interface UserUpdatedPayload {
  userId: string;
  email?: string;
  name?: string;
  role?: string;
  updatedAt: string;
}

export interface UserDeletedPayload {
  userId: string;
  deletedAt: string;
}

// Task domain payloads
export interface TaskCreatedPayload {
  taskId: string;
  title: string;
  userId: string;
  userName: string;
  createdAt: string;
}

export interface TaskUpdatedPayload {
  taskId: string;
  title?: string;
  status?: string;
  updatedAt: string;
}

export interface TaskCompletedPayload {
  taskId: string;
  userId: string;
  completedAt: string;
}

// Dead Letter Queue payload
export interface DLQPayload {
  originalTopic: string;
  originalMessage: unknown;
  error: {
    message: string;
    stack?: string;
  };
  failedAt: string;
  retryCount: number;
}

// Message metadata from consumer
export interface MessageMetadata {
  topic: string;
  partition: number;
  offset: string;
  headers: Record<string, string>;
  correlationId: string;
}

// Type-safe message factory function
export function createMessage<T>(
  event: string,
  data: T,
  source: string,
  correlationId?: string
): KafkaMessage<T> {
  return {
    correlationId: correlationId || randomUUID(),
    timestamp: new Date().toISOString(),
    version: "1.0",
    source,
    event,
    data,
  };
}

// Validate message structure
export function isValidKafkaMessage(message: unknown): message is KafkaMessage {
  if (!message || typeof message !== "object") return false;
  
  const msg = message as Record<string, unknown>;
  return (
    typeof msg.correlationId === "string" &&
    typeof msg.timestamp === "string" &&
    typeof msg.event === "string" &&
    msg.data !== undefined
  );
}

