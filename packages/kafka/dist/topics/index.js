"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LEGACY_TOPICS = exports.TOPICS = void 0;
// Topic definitions with versioning support for future compatibility
exports.TOPICS = {
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
};
// Legacy topic names for backward compatibility
exports.LEGACY_TOPICS = {
    USER_CREATED: "user-created",
    USER_UPDATED: "user-updated",
    USER_DELETED: "user-deleted",
};
