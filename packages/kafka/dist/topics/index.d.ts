export declare const TOPICS: {
    readonly USER: {
        readonly CREATED: "user.created.v1";
        readonly UPDATED: "user.updated.v1";
        readonly DELETED: "user.deleted.v1";
    };
    readonly TASK: {
        readonly CREATED: "task.created.v1";
        readonly UPDATED: "task.updated.v1";
        readonly COMPLETED: "task.completed.v1";
        readonly DELETED: "task.deleted.v1";
    };
    readonly DLQ: {
        readonly NOTIFICATION: "dlq.notification.v1";
        readonly GENERAL: "dlq.general.v1";
    };
};
export type UserTopic = (typeof TOPICS.USER)[keyof typeof TOPICS.USER];
export type TaskTopic = (typeof TOPICS.TASK)[keyof typeof TOPICS.TASK];
export type DLQTopic = (typeof TOPICS.DLQ)[keyof typeof TOPICS.DLQ];
export type TopicName = UserTopic | TaskTopic | DLQTopic;
//# sourceMappingURL=index.d.ts.map