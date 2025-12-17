"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userConsumer_1 = require("./consumers/userConsumer");
const emailService_1 = require("./services/emailService");
async function main() {
    console.log("==========>>>>>>Notification service starting...");
    try {
        // Initialize email service
        await emailService_1.emailService.initialize();
        // Start Kafka consumer for user events
        await (0, userConsumer_1.startUserConsumer)();
        console.log("✅ Notification service running and listening for events!");
        // Log configuration
        console.log("📋 Configuration:");
        console.log(`   - Using new Kafka API: ${process.env.USE_NEW_KAFKA_API === "true"}`);
        console.log(`   - Email service status: ${emailService_1.emailService.getStatus().ready ? "Ready" : "Not ready"}`);
    }
    catch (error) {
        console.error("❌ Failed to start notification service:", error);
        process.exit(1);
    }
}
// Graceful shutdown handlers
async function shutdown(signal) {
    console.log(`\n${signal} received. Shutting down notification service...`);
    try {
        await (0, userConsumer_1.stopUserConsumer)();
        console.log("✅ Graceful shutdown completed");
        process.exit(0);
    }
    catch (error) {
        console.error("❌ Error during shutdown:", error);
        process.exit(1);
    }
}
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
    console.error("❌ Uncaught exception:", error);
    shutdown("uncaughtException");
});
process.on("unhandledRejection", (reason, promise) => {
    console.error("❌ Unhandled rejection at:", promise, "reason:", reason);
});
main();
