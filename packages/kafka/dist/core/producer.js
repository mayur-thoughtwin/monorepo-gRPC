"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaProducer = exports.kafkaProducer = void 0;
const kafkajs_1 = require("kafkajs");
const kafka_config_1 = require("../config/kafka.config");
const messages_1 = require("../types/messages");
class KafkaProducer {
    constructor() {
        this.producer = null;
        this.isConnected = false;
        this.connectionPromise = null;
        this.kafka = new kafkajs_1.Kafka({
            clientId: kafka_config_1.kafkaConfig.clientId,
            brokers: kafka_config_1.kafkaConfig.brokers,
            logLevel: kafka_config_1.kafkaConfig.logLevel,
            retry: kafka_config_1.kafkaConfig.retry,
        });
    }
    async connect() {
        if (this.isConnected)
            return;
        // Prevent multiple simultaneous connection attempts
        if (this.connectionPromise) {
            return this.connectionPromise;
        }
        this.connectionPromise = this._connect();
        try {
            await this.connectionPromise;
        }
        finally {
            this.connectionPromise = null;
        }
    }
    async _connect() {
        this.producer = this.kafka.producer({
            allowAutoTopicCreation: true,
            transactionTimeout: 30000,
            idempotent: true, // Enable exactly-once semantics
        });
        await this.producer.connect();
        this.isConnected = true;
        console.log("✅ Kafka producer connected");
    }
    async disconnect() {
        if (!this.producer || !this.isConnected)
            return;
        await this.producer.disconnect();
        this.isConnected = false;
        this.producer = null;
        console.log("Kafka producer disconnected");
    }
    async send(topic, event, data, source, key) {
        if (!this.producer || !this.isConnected) {
            await this.connect();
        }
        const message = (0, messages_1.createMessage)(event, data, source);
        const record = {
            topic,
            compression: kafkajs_1.CompressionTypes.GZIP, // Compress for better throughput
            messages: [
                {
                    key: key || message.correlationId,
                    value: JSON.stringify(message),
                    headers: {
                        correlationId: message.correlationId,
                        event,
                        source,
                        timestamp: message.timestamp,
                    },
                },
            ],
        };
        await this.producer.send(record);
        console.log(`📤 [${message.correlationId}] Message sent to ${topic} (event: ${event})`);
        return message.correlationId;
    }
    async sendWithCorrelation(topic, event, data, source, correlationId) {
        if (!this.producer || !this.isConnected) {
            await this.connect();
        }
        const message = (0, messages_1.createMessage)(event, data, source, correlationId);
        const record = {
            topic,
            compression: kafkajs_1.CompressionTypes.GZIP,
            messages: [
                {
                    key: correlationId,
                    value: JSON.stringify(message),
                    headers: {
                        correlationId,
                        event,
                        source,
                        timestamp: message.timestamp,
                    },
                },
            ],
        };
        await this.producer.send(record);
        console.log(`📤 [${correlationId}] Message sent to ${topic} (event: ${event})`);
    }
    // Batch sending for high throughput scenarios
    async sendBatch(topic, messages, source) {
        if (!this.producer || !this.isConnected) {
            await this.connect();
        }
        const correlationIds = [];
        const kafkaMessages = messages.map((msg) => {
            const message = (0, messages_1.createMessage)(msg.event, msg.data, source);
            correlationIds.push(message.correlationId);
            return {
                key: msg.key || message.correlationId,
                value: JSON.stringify(message),
                headers: {
                    correlationId: message.correlationId,
                    event: msg.event,
                    source,
                },
            };
        });
        await this.producer.send({
            topic,
            compression: kafkajs_1.CompressionTypes.GZIP,
            messages: kafkaMessages,
        });
        console.log(`📤 Batch of ${messages.length} messages sent to ${topic}`);
        return correlationIds;
    }
    // Health check for monitoring
    async healthCheck() {
        return this.isConnected && this.producer !== null;
    }
    getStatus() {
        return { connected: this.isConnected };
    }
}
exports.KafkaProducer = KafkaProducer;
// Singleton instance
exports.kafkaProducer = new KafkaProducer();
