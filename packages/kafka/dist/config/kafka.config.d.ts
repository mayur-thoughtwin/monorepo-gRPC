import { logLevel } from "kafkajs";
interface KafkaEnvironmentConfig {
    brokers: string[];
    clientId: string;
    logLevel: logLevel;
    connectionTimeout: number;
    requestTimeout: number;
    retry: {
        initialRetryTime: number;
        retries: number;
        maxRetryTime: number;
    };
}
export declare const kafkaConfig: KafkaEnvironmentConfig;
export type { KafkaEnvironmentConfig };
//# sourceMappingURL=kafka.config.d.ts.map