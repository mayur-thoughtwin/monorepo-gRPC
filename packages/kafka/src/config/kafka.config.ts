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

const getKafkaConfig = (): KafkaEnvironmentConfig => {
  const env = process.env.NODE_ENV || "development";

  const baseConfig: KafkaEnvironmentConfig = {
    brokers: process.env.KAFKA_BROKERS?.split(",") || ["localhost:9092"],
    clientId: process.env.KAFKA_CLIENT_ID || "monorepo-grpc",
    logLevel: env === "production" ? logLevel.ERROR : logLevel.INFO,
    connectionTimeout: 10000,
    requestTimeout: 30000,
    retry: {
      initialRetryTime: 300,
      retries: 8,
      maxRetryTime: 30000,
    },
  };

  return baseConfig;
};

export const kafkaConfig = getKafkaConfig();
export type { KafkaEnvironmentConfig };

