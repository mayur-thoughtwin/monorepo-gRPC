"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaConsumerManager = exports.kafkaConsumerManager = void 0;
const kafkajs_1 = require("kafkajs");
const kafka_config_1 = require("../config/kafka.config");
const messages_1 = require("../types/messages");
const topics_1 = require("../topics");
const producer_1 = require("./producer");
// Default consumer options
const DEFAULT_OPTIONS = {
    fromBeginning: false,
    maxRetries: 3,
    enableDLQ: true,
    sessionTimeout: 30000,
    heartbeatInterval: 3000,
};
class KafkaConsumerManager {
    constructor() {
        this.consumers = new Map();
        this.kafka = new kafkajs_1.Kafka({
            clientId: `${kafka_config_1.kafkaConfig.clientId}-consumer`,
            brokers: kafka_config_1.kafkaConfig.brokers,
            logLevel: kafka_config_1.kafkaConfig.logLevel,
            retry: kafka_config_1.kafkaConfig.retry,
        });
    }
    async createConsumer(options, handler) {
        const opts = { ...DEFAULT_OPTIONS, ...options };
        const consumer = this.kafka.consumer({
            groupId: opts.groupId,
            sessionTimeout: opts.sessionTimeout,
            heartbeatInterval: opts.heartbeatInterval,
            retry: { retries: opts.maxRetries },
        });
        await consumer.connect();
        console.log(`✅ Consumer [${opts.groupId}] connected`);
        // Subscribe to all specified topics
        for (const topic of opts.topics) {
            await consumer.subscribe({
                topic,
                fromBeginning: opts.fromBeginning
            });
            console.log(`🎧 Consumer [${opts.groupId}] subscribed to: ${topic}`);
        }
        // Start consuming messages
        await consumer.run({
            autoCommit: true,
            autoCommitInterval: 5000,
            eachMessage: async (payload) => {
                await this.processMessage(payload, handler, opts);
            },
        });
        this.consumers.set(opts.groupId, consumer);
        console.log(`✅ Consumer [${opts.groupId}] started and listening`);
        return consumer;
    }
    async processMessage(payload, handler, options) {
        const { topic, partition, message } = payload;
        const value = message.value?.toString();
        if (!value) {
            console.warn(`Empty message received on ${topic}:${partition}`);
            return;
        }
        const headers = this.parseHeaders(message.headers);
        const correlationId = headers.correlationId || "unknown";
        try {
            const parsedMessage = JSON.parse(value);
            if (!(0, messages_1.isValidKafkaMessage)(parsedMessage)) {
                throw new Error("Invalid message structure");
            }
            console.log(`📥 [${correlationId}] Processing message from ${topic} (event: ${parsedMessage.event})`);
            const metadata = {
                topic,
                partition,
                offset: message.offset,
                headers,
                correlationId: parsedMessage.correlationId,
            };
            await handler(parsedMessage, metadata);
            console.log(`✅ [${correlationId}] Message processed successfully`);
        }
        catch (error) {
            console.error(`❌ [${correlationId}] Failed to process message:`, error);
            if (options.enableDLQ) {
                await this.sendToDLQ(topic, value, error, correlationId);
            }
        }
    }
    parseHeaders(headers) {
        const result = {};
        if (!headers)
            return result;
        for (const [key, value] of Object.entries(headers)) {
            if (value) {
                result[key] = Buffer.isBuffer(value) ? value.toString() : String(value);
            }
        }
        return result;
    }
    async sendToDLQ(originalTopic, messageValue, error, correlationId) {
        try {
            let originalMessage;
            try {
                originalMessage = JSON.parse(messageValue);
            }
            catch {
                originalMessage = messageValue;
            }
            const dlqPayload = {
                originalTopic,
                originalMessage,
                error: {
                    message: error.message,
                    stack: error.stack,
                },
                failedAt: new Date().toISOString(),
                retryCount: 0,
            };
            await producer_1.kafkaProducer.sendWithCorrelation(topics_1.TOPICS.DLQ.NOTIFICATION, "DLQ_MESSAGE", dlqPayload, "kafka-consumer-manager", correlationId);
            console.log(`📤 [${correlationId}] Message sent to DLQ`);
        }
        catch (dlqError) {
            console.error(`❌ [${correlationId}] Failed to send to DLQ:`, dlqError);
        }
    }
    async getConsumer(groupId) {
        return this.consumers.get(groupId);
    }
    async disconnectConsumer(groupId) {
        const consumer = this.consumers.get(groupId);
        if (consumer) {
            await consumer.disconnect();
            this.consumers.delete(groupId);
            console.log(`Consumer [${groupId}] disconnected`);
        }
    }
    async disconnectAll() {
        const disconnectPromises = Array.from(this.consumers.entries()).map(async ([groupId, consumer]) => {
            await consumer.disconnect();
            console.log(`Consumer [${groupId}] disconnected`);
        });
        await Promise.all(disconnectPromises);
        this.consumers.clear();
        console.log("All consumers disconnected");
    }
    // Health check for all consumers
    getStatus() {
        return {
            consumers: Array.from(this.consumers.keys()),
            count: this.consumers.size,
        };
    }
}
exports.KafkaConsumerManager = KafkaConsumerManager;
// Singleton instance
exports.kafkaConsumerManager = new KafkaConsumerManager();
