// Topic definitions with versioning support for future compatibility
export const TOPICS = {
  USER: {
    CREATED: "user.created.v1",
    UPDATED: "user.updated.v1",
    DELETED: "user.deleted.v1",
  },
  TASK: {
    CREATED: "task.created.v1",
    UPDATED: "task.updated.v1",
    COMPLETED: "task.completed.v1",
    DELETED: "task.deleted.v1",
  },
  DLQ: {
    NOTIFICATION: "dlq.notification.v1",
    GENERAL: "dlq.general.v1",
  },
} as const;

// Legacy topic names for backward compatibility
export const LEGACY_TOPICS = {
  USER_CREATED: "user-created",
  USER_UPDATED: "user-updated",
  USER_DELETED: "user-deleted",
} as const;

// Type-safe topic name types
export type UserTopic = (typeof TOPICS.USER)[keyof typeof TOPICS.USER];
export type TaskTopic = (typeof TOPICS.TASK)[keyof typeof TOPICS.TASK];
export type DLQTopic = (typeof TOPICS.DLQ)[keyof typeof TOPICS.DLQ];
export type TopicName = UserTopic | TaskTopic | DLQTopic;

