"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOPICS_V1 = exports.TOPICS_LEGACY = exports.kafka = exports.logLevel = exports.isValidKafkaMessage = exports.createMessage = exports.KafkaConsumerManager = exports.KafkaProducer = exports.kafkaConsumerManager = exports.kafkaProducer = exports.LEGACY_TOPICS = exports.TOPICS = exports.kafkaConfig = void 0;
exports.getProducer = getProducer;
exports.disconnectProducer = disconnectProducer;
exports.sendMessage = sendMessage;
exports.createConsumer = createConsumer;
exports.subscribeToTopic = subscribeToTopic;
// Main exports - organized by module
var kafka_config_1 = require("./config/kafka.config");
Object.defineProperty(exports, "kafkaConfig", { enumerable: true, get: function () { return kafka_config_1.kafkaConfig; } });
var topics_1 = require("./topics");
Object.defineProperty(exports, "TOPICS", { enumerable: true, get: function () { return topics_1.TOPICS; } });
Object.defineProperty(exports, "LEGACY_TOPICS", { enumerable: true, get: function () { return topics_1.LEGACY_TOPICS; } });
var core_1 = require("./core");
Object.defineProperty(exports, "kafkaProducer", { enumerable: true, get: function () { return core_1.kafkaProducer; } });
Object.defineProperty(exports, "kafkaConsumerManager", { enumerable: true, get: function () { return core_1.kafkaConsumerManager; } });
Object.defineProperty(exports, "KafkaProducer", { enumerable: true, get: function () { return core_1.KafkaProducer; } });
Object.defineProperty(exports, "KafkaConsumerManager", { enumerable: true, get: function () { return core_1.KafkaConsumerManager; } });
var messages_1 = require("./types/messages");
Object.defineProperty(exports, "createMessage", { enumerable: true, get: function () { return messages_1.createMessage; } });
Object.defineProperty(exports, "isValidKafkaMessage", { enumerable: true, get: function () { return messages_1.isValidKafkaMessage; } });
// Re-export kafkajs types that consumers might need
var kafkajs_1 = require("kafkajs");
Object.defineProperty(exports, "logLevel", { enumerable: true, get: function () { return kafkajs_1.logLevel; } });
// ============================================
// BACKWARD COMPATIBILITY LAYER
// These exports maintain compatibility with existing code
// TODO: Migrate consumers to use new API and remove this section
// ============================================
const kafkajs_2 = require("kafkajs");
const kafka_config_2 = require("./config/kafka.config");
const producer_1 = require("./core/producer");
const messages_2 = require("./types/messages");
// Legacy kafka instance (avoid using directly)
const kafka = new kafkajs_2.Kafka({
    clientId: kafka_config_2.kafkaConfig.clientId,
    brokers: kafka_config_2.kafkaConfig.brokers,
    logLevel: kafka_config_2.kafkaConfig.logLevel,
});
exports.kafka = kafka;
// Legacy topic names for backward compatibility
const LEGACY_TOPIC_NAMES = {
    USER_CREATED: "user-created",
    USER_UPDATED: "user-updated",
    USER_DELETED: "user-deleted",
};
exports.TOPICS_LEGACY = LEGACY_TOPIC_NAMES;
exports.TOPICS_V1 = LEGACY_TOPIC_NAMES;
// Legacy producer functions
let legacyProducer = null;
async function getProducer() {
    if (!legacyProducer) {
        legacyProducer = kafka.producer();
        await legacyProducer.connect();
        console.log("✅ Kafka producer connected (legacy)");
    }
    return legacyProducer;
}
async function disconnectProducer() {
    if (legacyProducer) {
        await legacyProducer.disconnect();
        legacyProducer = null;
        console.log("Kafka producer disconnected (legacy)");
    }
    // Also disconnect new producer
    await producer_1.kafkaProducer.disconnect();
}
async function sendMessage(topic, event, data) {
    const producer = await getProducer();
    const message = (0, messages_2.createMessage)(event, data, "legacy-producer");
    await producer.send({
        topic,
        messages: [
            {
                key: event,
                value: JSON.stringify(message),
            },
        ],
    });
    console.log(`📤 Kafka message sent to topic: ${topic}, event: ${event}`);
}
// Legacy consumer functions
async function createConsumer(groupId) {
    const consumer = kafka.consumer({ groupId });
    await consumer.connect();
    console.log(`✅ Kafka consumer connected (group: ${groupId})`);
    return consumer;
}
async function subscribeToTopic(consumer, topic, handler) {
    await consumer.subscribe({ topic, fromBeginning: false });
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try {
                const value = message.value?.toString();
                if (value) {
                    const parsedMessage = JSON.parse(value);
                    console.log(`📥 Kafka message received from topic: ${topic}`);
                    await handler(parsedMessage);
                }
            }
            catch (error) {
                console.error("Error processing Kafka message:", error);
            }
        },
    });
}
