"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kafkaConfig = void 0;
const kafkajs_1 = require("kafkajs");
const getKafkaConfig = () => {
    const env = process.env.NODE_ENV || "development";
    const baseConfig = {
        brokers: process.env.KAFKA_BROKERS?.split(",") || ["localhost:9092"],
        clientId: process.env.KAFKA_CLIENT_ID || "monorepo-grpc",
        logLevel: env === "production" ? kafkajs_1.logLevel.ERROR : kafkajs_1.logLevel.INFO,
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
exports.kafkaConfig = getKafkaConfig();
