"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kafka = exports.TOPICS = void 0;
exports.getProducer = getProducer;
exports.disconnectProducer = disconnectProducer;
exports.sendMessage = sendMessage;
exports.createConsumer = createConsumer;
exports.subscribeToTopic = subscribeToTopic;
const kafkajs_1 = require("kafkajs");
// Kafka configuration
const KAFKA_BROKERS = process.env.KAFKA_BROKERS?.split(",") || ["localhost:9092"];
const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID || "monorepo-grpc";
// Create Kafka instance
const kafka = new kafkajs_1.Kafka({
    clientId: KAFKA_CLIENT_ID,
    brokers: KAFKA_BROKERS,
    logLevel: kafkajs_1.logLevel.ERROR,
});
exports.kafka = kafka;
// Topic names
exports.TOPICS = {
    USER_CREATED: "user-created",
    USER_UPDATED: "user-updated",
    USER_DELETED: "user-deleted",
};
// Producer singleton
let producer = null;
async function getProducer() {
    if (!producer) {
        producer = kafka.producer();
        await producer.connect();
        console.log("✅ Kafka producer connected");
    }
    return producer;
}
async function disconnectProducer() {
    if (producer) {
        await producer.disconnect();
        producer = null;
        console.log("Kafka producer disconnected");
    }
}
// Send message to topic
async function sendMessage(topic, event, data) {
    const kafkaProducer = await getProducer();
    const message = {
        event,
        data,
        timestamp: new Date().toISOString(),
    };
    await kafkaProducer.send({
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
// Consumer creation
async function createConsumer(groupId) {
    const consumer = kafka.consumer({ groupId });
    await consumer.connect();
    console.log(`✅ Kafka consumer connected (group: ${groupId})`);
    return consumer;
}
// Subscribe and consume messages
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
