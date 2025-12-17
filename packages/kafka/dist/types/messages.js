"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessage = createMessage;
exports.isValidKafkaMessage = isValidKafkaMessage;
const crypto_1 = require("crypto");
// Type-safe message factory function
function createMessage(event, data, source, correlationId) {
    return {
        correlationId: correlationId || (0, crypto_1.randomUUID)(),
        timestamp: new Date().toISOString(),
        version: "1.0",
        source,
        event,
        data,
    };
}
// Validate message structure
function isValidKafkaMessage(message) {
    if (!message || typeof message !== "object")
        return false;
    const msg = message;
    return (typeof msg.correlationId === "string" &&
        typeof msg.timestamp === "string" &&
        typeof msg.event === "string" &&
        msg.data !== undefined);
}
