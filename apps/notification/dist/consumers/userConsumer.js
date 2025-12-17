"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startUserConsumerNew = startUserConsumerNew;
exports.stopUserConsumerNew = stopUserConsumerNew;
exports.startUserConsumer = startUserConsumer;
exports.stopUserConsumer = stopUserConsumer;
const kafka_1 = require("@repo/kafka");
const user_handler_1 = require("../handlers/user.handler");
const emailService_1 = require("../services/emailService");
let consumer = null;
const CONSUMER_GROUP_ID = "notification-service";
// ============================================
// NEW API - Using refactored Kafka modules
// ============================================
async function startUserConsumerNew() {
    try {
        console.log("🚀 Starting notification consumer with new API...");
        await kafka_1.kafkaConsumerManager.createConsumer({
            groupId: CONSUMER_GROUP_ID,
            topics: [
                kafka_1.TOPICS.USER.CREATED,
                kafka_1.TOPICS.USER.UPDATED,
            ],
            enableDLQ: true,
            maxRetries: 3,
        }, async (message, metadata) => {
            await user_handler_1.userEventHandler.handleMessage(message, metadata);
        });
        console.log("✅ Notification consumer started with new API");
    }
    catch (error) {
        console.error("❌ Failed to start notification consumer:", error);
        throw error;
    }
}
async function stopUserConsumerNew() {
    await kafka_1.kafkaConsumerManager.disconnectConsumer(CONSUMER_GROUP_ID);
    console.log("Notification consumer stopped");
}
// ============================================
// LEGACY API - For backward compatibility
// ============================================
async function handleUserCreatedMessage(message) {
    if (message.event === "USER_CREATED") {
        const userData = message.data;
        console.log(`📬 Processing user created event for: ${userData.email}`);
        // Send welcome email
        const emailSent = await (0, emailService_1.sendWelcomeEmail)(userData.email, userData.name);
        if (emailSent) {
            console.log(`✅ Welcome email sent to ${userData.email}`);
        }
        else {
            console.error(`❌ Failed to send welcome email to ${userData.email}`);
        }
    }
}
async function startUserConsumer() {
    try {
        // Try new API first, fall back to legacy
        const useNewApi = process.env.USE_NEW_KAFKA_API === "true";
        if (useNewApi) {
            await startUserConsumerNew();
            return;
        }
        // Legacy implementation
        consumer = await (0, kafka_1.createConsumer)(CONSUMER_GROUP_ID);
        await (0, kafka_1.subscribeToTopic)(consumer, kafka_1.LEGACY_TOPICS.USER_CREATED, handleUserCreatedMessage);
        console.log(`🎧 Listening for user events on topic: ${kafka_1.LEGACY_TOPICS.USER_CREATED}`);
    }
    catch (error) {
        console.error("Failed to start user consumer:", error);
        throw error;
    }
}
async function stopUserConsumer() {
    const useNewApi = process.env.USE_NEW_KAFKA_API === "true";
    if (useNewApi) {
        await stopUserConsumerNew();
        return;
    }
    // Legacy implementation
    if (consumer) {
        await consumer.disconnect();
        consumer = null;
        console.log("User consumer disconnected");
    }
}
