export interface BaseKafkaMessage {
    correlationId: string;
    timestamp: string;
    version: string;
    source: string;
}
export interface KafkaMessage<T = unknown> extends BaseKafkaMessage {
    event: string;
    data: T;
}
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
export interface TaskCreatedPayload {
    taskId: string;
    title: string;
    userId: string;
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
export interface MessageMetadata {
    topic: string;
    partition: number;
    offset: string;
    headers: Record<string, string>;
    correlationId: string;
}
export declare function createMessage<T>(event: string, data: T, source: string, correlationId?: string): KafkaMessage<T>;
export declare function isValidKafkaMessage(message: unknown): message is KafkaMessage;
//# sourceMappingURL=messages.d.ts.map